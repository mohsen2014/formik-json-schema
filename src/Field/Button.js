import React from 'react';

const IconButton = ({ config, formik }) => {
  const {
    content, fieldClass, buttonType, onClick,
  } = config;
  const { isSubmitting } = formik;

  const buttonProps = {
    type: buttonType || 'button',
    className: `btn ${fieldClass}`,
    disabled: isSubmitting,
  };

  if (typeof onClick === 'function') {
    buttonProps.onClick = onClick.bind(this, formik, config);
  }

  return (
    <button {...buttonProps}>
      { content }
      {' '}
      { buttonType === 'submit' && isSubmitting && <i className="fa fa-spinner fa-spin" /> }
    </button>
  );
};

export default IconButton;
