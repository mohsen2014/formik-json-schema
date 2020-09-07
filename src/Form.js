import _ from 'lodash';
import React, { useEffect, useCallback, useState } from 'react';
import { Formik } from 'formik';
import Rules from '@flipbyte/yup-schema';
import Element from './Element';
import { SchemaProvider } from './withFormConfig';
import { prepareValidationSchema } from './utils';

const FormikForm = ({ onUpdate, schema, ...formik }) => {
  /**
     * Callback if provided will be vcalled when form values change
     */
  useEffect(() => {
    if (typeof onUpdate === 'function') {
      onUpdate(formik);
    }
  }, [formik.values]);

  return <Element config={schema} />;
};

const Form = ({
  schema, onUpdate = () => {}, initialValues = {}, ...rest
}) => {
  const [validationSchema, setValidationSchema] = useState(null);
  /**
     * Initialize validation schema.
     *
     * Convert the validation schema rules from yup-schema array to yup object
     */
  const initValidationSchema = useCallback(() => {
    const yupSchema = prepareValidationSchema(schema);
    const validationSchema = !_.isEmpty(yupSchema) ? new Rules([['object', yupSchema]]).toYup() : null;
    setValidationSchema(validationSchema);
  }, [schema]);

  /**
     * Everytime the schema changes, re-initialize validationSchema
     *
     * This is has to be done everytime schema changes because,
     * certain cases may involve dynamically changing form fields based on
     * certain conditions, routes etc.
     */
  useEffect(() => {
    initValidationSchema();
  }, [schema]);

  const formProps = { ...rest, initialValues };
  if (validationSchema !== null) {
    formProps.validationSchema = validationSchema;
  }

  return (
    <SchemaProvider value={{ validationSchema, schema }}>
      <Formik
        {...formProps}
        // innerRef={ref}
        render={(props) => (
          <FormikForm
            onUpdate={onUpdate}
            schema={schema}
            {...props}
          />
        )}
      />
    </SchemaProvider>
  );
};

export default Form;
