// __tests__/fetch.test.js
import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DForm from '../DForm';

const renderForm = (field) => {
  const form = {
    sections: [{
      order: 1,
      title: 'Sec 1',
      fields: [field],
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
      renderSection={({ renderFields }) => renderFields()}
      renderNumberField={({
        onFieldChange,
        error,
        value,
        inputValue,
      }) => (
        <div>
          <div data-testid="field-formik-value">{value}</div>
          <input
            data-testid="field-input"
            onChange={(e) => onFieldChange(e.target.value)}
            value={inputValue}
            readOnly={field.schema.readOnly}
          />
          <div data-testid="field-errors">{error}</div>
        </div>
      )}
    />,
  );
};

test('default integer value', async () => {
  const field = {
    id: 1,
    order: 1,
    title: 'El num',
    fieldType: 'number',
    schema: {
      defaultValue: 450,
    },
  };
  renderForm(field);
  expect(screen.queryByTestId('field-input')).toHaveValue(String(field.schema.defaultValue));
});

test('default float value', async () => {
  const field = {
    id: 1,
    order: 1,
    title: 'El num',
    fieldType: 'number',
    schema: {
      defaultValue: 4.50,
    },
  };
  renderForm(field);
  expect(screen.queryByTestId('field-input')).toHaveValue(String(field.schema.defaultValue));
});

test('integer max and min validation', async () => {
  const field = {
    id: 1,
    order: 1,
    title: 'El num',
    fieldType: 'number',
    schema: {
      min: 10,
      max: 20,
    },
  };
  renderForm(field);

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '9' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-errors'),
    ).toHaveTextContent('El num debe ser un valor mayor o igual que 10')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '21' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-errors'),
    ).toHaveTextContent('El num debe ser un valor menor o igual que 20')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '19' } });
  await waitFor(() => expect(screen.queryByTestId('field-errors')).toBeEmptyDOMElement());
});

test('float max and min validation', async () => {
  const field = {
    id: 1,
    order: 1,
    title: 'El num',
    fieldType: 'number',
    schema: {
      format: 'number',
      min: 10.5,
      max: 20.8,
    },
  };
  renderForm(field);

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '10.40' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-errors'),
    ).toHaveTextContent('El num debe ser un valor mayor o igual que 10.5')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '20.90' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-errors'),
    ).toHaveTextContent('El num debe ser un valor menor o igual que 20.8')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '19.00' } });
  await waitFor(() => expect(screen.queryByTestId('field-errors')).toBeEmptyDOMElement());
});

test('read only', async () => {
  const field = {
    id: 1,
    order: 1,
    title: 'El num',
    fieldType: 'number',
    schema: {
      format: 'number',
      readOnly: true,
    },
  };
  renderForm(field);
  await waitFor(() => expect(screen.queryByTestId('field-input')).toHaveAttribute('readonly'));
});

test('float number transformation(two decimals)', async () => {
  const field = {
    id: 1,
    order: 1,
    title: 'El num',
    fieldType: 'number',
    schema: {
      format: 'number',
      min: 10.5,
      max: 20.8,
    },
  };
  renderForm(field);

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '1040' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-input'),
    ).toHaveValue('10.40')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '104666' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-input'),
    ).toHaveValue('1046.66')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '1046660' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-input'),
    ).toHaveValue('10466.60')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '00666' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-input'),
    ).toHaveValue('6.66')
  ));
});
