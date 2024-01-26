import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'constants/appConstant';
import React, { useState, useCallback, useEffect } from 'react';

import { SingleDatePicker } from 'react-dates';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

const SingleDateTime = (props) => {
  const { id, value, onChange, placeholder, focused, onFocusChange, openDirection, disabled, readonly, ...rest } =
    props;

  const [inputFocused, setInputFocused] = useState(focused || false);
  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    if (!value) return;

    setInputValue(moment(value));
  }, [value]);

  const onInputFocusChange = useCallback(({ focused, ...rest }) => {
    setInputFocused(focused);

    onFocusChange && onFocusChange({ focused, ...rest });
  }, []);

  return (
    <SingleDatePicker
      id={id}
      date={inputValue}
      placeholder={placeholder}
      onDateChange={onChange}
      focused={inputFocused}
      onFocusChange={onInputFocusChange}
      numberOfMonths={1}
      isOutsideRange={() => false}
      displayFormat={DEFAULT_DATE_FORMAT}
      hideKeyboardShortcutsPanel
      block
      openDirection={openDirection || 'up'}
      noBorder={true}
      disabled={disabled}
      readOnly={readonly}
      {...rest}
    />
  );
};

export default SingleDateTime;
