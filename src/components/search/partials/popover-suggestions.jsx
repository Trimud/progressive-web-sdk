/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2020 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import SearchSuggestionsInner from './search-suggestions-inner'

const PopoverSuggestions = ({
    clickSuggestion,
    onClickSuggestion,
    productSuggestions,
    searchSuggestionClasses,
    suggestedProductsHeading,
    suggestedTermHeading,
    termSuggestions
}) => (
    <section className={searchSuggestionClasses}>
        <SearchSuggestionsInner
            clickSuggestion={clickSuggestion}
            onClickSuggestion={onClickSuggestion}
            productSuggestions={productSuggestions}
            suggestedProductsHeading={suggestedProductsHeading}
            suggestedTermHeading={suggestedTermHeading}
            termSuggestions={termSuggestions}
        />
    </section>
)

PopoverSuggestions.propTypes = {
    clickSuggestion: PropTypes.func,
    closePopover: PropTypes.func,
    productSuggestions: PropTypes.array,
    searchSuggestionClasses: PropTypes.string,
    suggestedProductsHeading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    suggestedTermHeading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    termSuggestions: PropTypes.array,
    onClickSuggestion: PropTypes.func
}

export default PopoverSuggestions
