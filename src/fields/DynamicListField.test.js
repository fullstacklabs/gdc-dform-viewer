// __tests__/fetch.test.js
import React from 'react';
import {
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
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
      renderDynamicListField={({ renderFields, addItem }) => (
        <div>
          <button type="button" onClick={() => addItem(0)} data-testid="add-item">
            Add Item
          </button>
          {renderFields()}
        </div>
      )}
      renderListItem={({ removeItem, index, item }) => (
        <div>
          <button type="button" onClick={removeItem} data-testid={`remove-item-${index}`}>
            Remove Item
          </button>
          {item}
        </div>
      )}
      renderTextField={({
        onFieldChange,
        error,
        value,
        index,
      }) => (
        <div>
          <input
            data-testid={`field-input-${index}`}
            onChange={(e) => onFieldChange(e.target.value)}
            value={value || ''}
          />
          <div data-testid={`field-errors-${index}`}>{error}</div>
        </div>
      )}
    />,
  );
};

test('list items add and remove', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'dynamicList',
    title: 'field',
    schema: {},
    templateFields: [{
      id: 2,
      order: 1,
      fieldType: 'text',
      title: 'field',
      schema: {
        defaultValue: '',
      },
    }],
  };
  renderForm(field);
  expect(screen.queryByTestId('field-input-0')).not.toBeInTheDocument();
  userEvent.click(screen.queryByTestId('add-item'));
  await waitFor(() => expect(screen.queryByTestId('field-input-0')).toBeInTheDocument());
  userEvent.click(screen.queryByTestId('add-item'));
  await waitFor(() => expect(screen.queryByTestId('field-input-0')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByTestId('field-input-1')).toBeInTheDocument());
  userEvent.type(screen.queryByTestId('field-input-0'), 'TEXT0');
  userEvent.type(screen.queryByTestId('field-input-1'), 'TEXT1');
  await waitFor(() => expect(screen.queryByTestId('field-input-0')).toHaveValue('TEXT0'));
  await waitFor(() => expect(screen.queryByTestId('field-input-1')).toHaveValue('TEXT1'));
  userEvent.click(screen.queryByTestId('remove-item-0'));
  await waitFor(() => expect(screen.queryByTestId('field-input-0')).toHaveValue('TEXT1'));
});

test('list items validation', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'dynamicList',
    title: 'field',
    schema: {},
    templateFields: [{
      id: 2,
      order: 1,
      fieldType: 'text',
      title: 'field',
      schema: {
        defaultValue: '',
        min: 3,
        max: 4,
      },
    }],
  };
  renderForm(field);
  userEvent.click(screen.queryByTestId('add-item'));
  userEvent.click(screen.queryByTestId('add-item'));
  userEvent.type(screen.queryByTestId('field-input-0'), 'T1');
  userEvent.type(screen.queryByTestId('field-input-1'), 'T2345');
  await waitFor(
    () => expect(
      screen.queryByTestId('field-errors-0'),
    ).toHaveTextContent('Debe tener mínimo 3 caracteres'),
  );
  await waitFor(
    () => expect(
      screen.queryByTestId('field-errors-1'),
    ).toHaveTextContent('Debe tener máximo 4 caracteres'),
  );
  await waitFor(
    () => expect(
      screen.queryByTestId('section'),
    ).toHaveTextContent('IS NOT VALID'),
  );
  userEvent.clear(screen.queryByTestId('field-input-0'));
  userEvent.clear(screen.queryByTestId('field-input-1'));
  userEvent.type(screen.queryByTestId('field-input-0'), 'T12');
  userEvent.type(screen.queryByTestId('field-input-1'), 'T23');
  await waitFor(() => expect(screen.queryByTestId('field-errors-0')).toBeEmptyDOMElement());
  await waitFor(() => expect(screen.queryByTestId('field-errors-1')).toBeEmptyDOMElement());
  await waitFor(
    () => expect(
      screen.queryByTestId('section'),
    ).toHaveTextContent('IS VALID'),
  );
});

test('list required validation', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'dynamicList',
    title: 'field',
    schema: {},
    required: true,
    templateFields: [{
      id: 2,
      order: 1,
      fieldType: 'text',
      title: 'field',
      schema: {
        defaultValue: '',
      },
    }],
  };
  renderForm(field);
  await waitFor(() => expect(screen.queryByTestId('section')).toHaveTextContent('IS NOT VALID'));
  userEvent.click(screen.queryByTestId('add-item'));
  await waitFor(() => expect(screen.queryByTestId('section')).toHaveTextContent('IS VALID'));
});
