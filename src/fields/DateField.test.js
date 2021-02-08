import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// import moment from 'moment';
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
      renderDateField={({
        onFieldChange,
        error,
        value,
      }) => (
        <div>
          <input
            data-testid="field-input"
            onChange={(e) => onFieldChange(e.target.value)}
            value={value || ''}
            readOnly={field.schema.readOnly}
          />
          <div data-testid="field-errors">{error}</div>
        </div>
      )}
    />,
  );
};

test('default date value', async () => {
  const field = {
    id: 1,
    order: 1,
    title: 'El date',
    fieldType: 'date',
    schema: {
      format: 'date',
      defaultValue: '2020-01-06',
    },
  };
  renderForm(field);
  expect(screen.queryByTestId('field-input')).toHaveValue(field.schema.defaultValue);
});

test('date-time max and min validation', async () => {
  const field = {
    id: 1,
    order: 1,
    title: 'El num',
    fieldType: 'date',
    schema: {
      format: 'date-time',
      min: '2020-01-23T00:00:00',
      max: '2020-09-13T00:00:00',
    },
  };
  renderForm(field);

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '2020-01-22' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-errors'),
    ).toHaveTextContent('La fecha/hora debe ser mayor o igual a 2020-01-23 12:00 am')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '2020-09-14' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-errors'),
    ).toHaveTextContent('La fecha/hora debe ser menor o igual a 2020-09-13 12:00 am')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '2020-09-13' } });
  await waitFor(() => expect(screen.queryByTestId('field-errors')).toBeEmptyDOMElement());
});

test('time max and min validation', async () => {
  const field = {
    id: 1,
    order: 1,
    title: 'El num',
    fieldType: 'date',
    schema: {
      format: 'time',
      min: '08:00:06-05:00',
      max: '15:00:06-05:00',
    },
  };
  renderForm(field);

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '2020-01-23T07:59' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-errors'),
    ).toHaveTextContent('La hora debe ser mayor o igual a 08:00 AM')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '2020-01-23T15:01' } });
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-errors'),
    ).toHaveTextContent('La hora debe ser menor o igual a 03:00 PM')
  ));

  fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '2020-01-23T08:00' } });
  await waitFor(() => expect(screen.queryByTestId('field-errors')).toBeEmptyDOMElement());
});

// test('date minCurrentDate', async () => {
//   const field = {
//     id: 1,
//     order: 1,
//     title: 'El num',
//     fieldType: 'date',
//     schema: {
//       format: 'date',
//       minCurrentDate: true,
//     },
//   };
//   renderForm(field);
//
//   fireEvent.change(screen.queryByTestId('field-input'), { target: { value: moment() } });
//   await waitFor(() => (
//     expect(
//       screen.queryByTestId('field-errors'),
//     ).toHaveTextContent('La hora debe ser mayor o igual a 08:00 AM')
//   ));
//   fireEvent.change(screen.queryByTestId('field-input'), { target: { value: '2020' } });
//   await waitFor(() => expect(screen.queryByTestId('field-errors')).toBeEmptyDOMElement());
// });
