// __tests__/fetch.test.js
import React from 'react';
import {
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import DForm from '../DForm';

const renderForm = (f) => {
  const form = {
    sections: [{
      order: 1,
      title: 'Sec 1',
      fields: [f],
    }],
  };

  render(
    <DForm
      form={form}
      sectionIndex={0}
      answers={[]}
      formikValues={{}}
      formikTouched={{}}
      onSectionNext={() => {}}
      onSubmit={() => {}}
      renderSection={({ renderFields, isValid }) => (
        <div>
          <div data-testid="section">
            {isValid ? 'IS VALID' : 'IS NOT VALID'}
          </div>
          {renderFields()}
        </div>
      )}
      renderTextField={({
        onFieldChange,
        error,
        value,
        field,
      }) => (
        <div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={(e) => onFieldChange(e.target.value)}
            value={value || ''}
            readOnly={field.schema.readOnly}
          />
          <div data-testid={`field-error-${field.id}`}>{error}</div>
        </div>
      )}
      renderNumberField={({
        onFieldChange,
        error,
        inputValue,
        field,
      }) => (
        <div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={(e) => onFieldChange(e.target.value)}
            value={inputValue || ''}
            readOnly={field.schema.readOnly}
          />
          <div data-testid={`field-error-${field.id}`}>{error}</div>
        </div>
      )}
      renderSelectField={({
        onFieldChange,
        error,
        field,
        renderSubForm,
        value,
      }) => (
        <div>
          <select
            aria-label="field-select"
            id="field-select"
            data-testid={`field-input-${field.id}`}
            onChange={e => onFieldChange(e.target.value)}
            multiple={field.schema.format === 'multipleSelect'}
            value={value || field.schema.format === 'multipleSelect' ? [] : ''}
          >
            {
              field.schema.options.map(option => (
                <option value={option} data-testid={`option-${option}`} key={option}>
                  {option}
                </option>
              ))
            }
          </select>
          <div data-testid={`field-error-${field.id}`}>{error}</div>
          <div data-testid="field-subform">{renderSubForm()}</div>
        </div>
      )}
    />,
  );
};

test('required validation for single select', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'select',
    required: true,
    title: 'field',
    schema: {
      format: 'singleSelect',
      options: ['option-a', 'option-b', 'option-c'],
    },
  };
  renderForm(field);
  await waitFor(
    () => expect(
      screen.queryByTestId('field-error-1'),
    ).toHaveTextContent('Debe seleccionar al menos una opción'),
  );
  userEvent.selectOptions(screen.queryByTestId('field-input-1'), 'option-b');
  await waitFor(() => expect(screen.queryByTestId('field-error-1')).toBeEmptyDOMElement());
});

test('required validation for multiple select', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'select',
    required: true,
    title: 'field',
    schema: {
      format: 'multipleSelect',
      options: ['option-a', 'option-b', 'option-c'],
    },
  };
  renderForm(field);
  await waitFor(
    () => expect(
      screen.queryByTestId('field-error-1'),
    ).toHaveTextContent('Debe seleccionar al menos una opción'),
  );
  userEvent.selectOptions(screen.getByTestId('field-input-1'), ['option-a', 'option-b']);
  await waitFor(() => expect(screen.queryByTestId('field-error-1')).toBeEmptyDOMElement());
});

test('subform render and valdiations', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'select',
    required: true,
    title: 'field',
    schema: {
      format: 'singleSelect',
      options: ['option-a', 'option-b', 'option-c', 'option-d'],
    },
    subforms: [{
      options: ['option-a'],
      fields: [{
        id: 2,
        order: 1,
        title: 'sf-field-2',
        fieldType: 'text',
        schema: {},
      }, {
        id: 3,
        order: 2,
        title: 'sf-field-3',
        fieldType: 'number',
        schema: {},
      }],
    }, {
      options: ['option-b', 'option-d'],
      fields: [{
        id: 4,
        order: 2,
        title: 'sf-field-4',
        fieldType: 'select',
        schema: {
          options: ['sb-option-a', 'sb-option-b'],
        },
      }, {
        id: 5,
        order: 1,
        title: 'sf-field-5',
        fieldType: 'text',
        required: true,
        schema: {},
      }],
    }],
  };
  renderForm(field);
  await waitFor(() => expect(screen.queryByTestId('field-subform')).toBeEmptyDOMElement());
  userEvent.selectOptions(screen.getByTestId('field-input-1'), 'option-a');
  await waitFor(() => expect(screen.queryByTestId('field-input-2')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByTestId('field-input-3')).toBeInTheDocument());
  userEvent.selectOptions(screen.getByTestId('field-input-1'), 'option-d');
  await waitFor(() => expect(screen.queryByTestId('field-input-2')).not.toBeInTheDocument());
  await waitFor(() => expect(screen.queryByTestId('field-input-3')).not.toBeInTheDocument());
  expect(screen.queryByTestId('field-input-4')).toBeInTheDocument();
  expect(screen.queryByTestId('field-input-5')).toBeInTheDocument();
  expect(screen.queryByTestId('field-error-5')).toHaveTextContent('*');
  expect(screen.queryByTestId('section')).toHaveTextContent('IS NOT VALID');
  userEvent.type(screen.queryByTestId('field-input-5'), 'some text');
  await waitFor(() => expect(screen.queryByTestId('field-error-5')).toBeEmptyDOMElement());
});
