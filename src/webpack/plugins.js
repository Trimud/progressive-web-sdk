/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2020 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import webpack from 'webpack'
import path from 'path'
import fs from 'fs'

/**
 * Return a NormalModuleReplacementPlugin that is used to override SDK builtins
 * with user code for special overridable components, eg. the Document.
 *
 * @param {Object} options
 * @param {Array} [options.replacements] - An array of objects consisting of a match path
 * and a replacement path.
 * @returns {webpack.NormalModuleReplacementPlugin} a module replacement plugin
 * configured with the passed in file replacements array.
 */
export const createModuleReplacementPlugin = (options = {}) => {
    const replacements = options.replacements || []

    return new webpack.NormalModuleReplacementPlugin(/.*/, (resource) => {
        const resolved = path.resolve(resource.context, resource.request)
        const replacement = replacements.find(({path}) => resolved.includes(path))

        const sdkPaths = [
            path.join('packages', 'progressive-web-sdk'),
            path.join('node_modules', 'progressive-web-sdk')
        ]

        const requestedFromSDK = sdkPaths.some((p) => resource.context.includes(p))

        if (requestedFromSDK && replacement) {
            resource.request = replacement.newPath
        }
    })
}

/**
 * Watches a webpack build and touches a "build marker" file when all files in the
 * webpack build have been compiled. Tools like nodemon can use the build marker
 * to restart the dev-server, for example.
 */
export class BuildMarkerPlugin {
    /**
     * @constructor
     * @param {Object} options
     * @param {String} [options.filename] - The path of the marker file you want to
     * touch once the current build is complete.
     */
    constructor(options = {}) {
        this.fileName = options.filename || 'build/build.marker'
        this.done = this.done.bind(this)
        this.compile = this.compile.bind(this)
        this.inProgress = 0
    }

    /**
     * Called by webpack when this plugin is attached.
     *
     * @param compiler {Object} the webpack compiler
     */
    apply(compiler) {
        if (compiler.hooks) {
            compiler.hooks.done.tap({name: 'BuildMarkerPlugin'}, this.done)
            compiler.hooks.compile.tap({name: 'BuildMarkerPlugin'}, this.compile)
        } else {
            compiler.plugin('done', this.done)
            compiler.plugin('compile', this.compile)
        }
    }

    /**
     * Called by webpack when a compilation starts.
     */
    compile() {
        this.inProgress += 1
    }

    /**
     * Called by webpack when a compilation ends. "Touches" the marker file when
     * there are no more compilations in progress.
     */
    done() {
        this.inProgress -= 1
        if (!this.inProgress) {
            fs.closeSync(fs.openSync(this.fileName, 'w'))
        }
    }
}
