import React from 'react';
import {
  render,
  // fireEvent,
  waitFor,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import DForm from './DForm';

const form = {
  sections: [{
    id: 1,
    order: 1,
    fields: [{
      id: 8,
      order: 1,
      fieldType: 'text',
      title: 'f8',
      schema: {},
    }, {
      id: 9,
      order: 2,
      fieldType: 'select',
      title: 'f9',
      schema: {
        format: 'multipleSelect',
        options: ['A', 'B', 'C'],
      },
    }],
  }, {
    id: 2,
    order: 2,
    fields: [{
      id: 1,
      order: 1,
      fieldType: 'text',
      title: 'f1',
      schema: {
        min: 2,
      },
    }, {
      id: 2,
      order: 2,
      fieldType: 'number',
      title: 'f2',
      schema: {},
    }, {
      id: 3,
      order: 3,
      fieldType: 'gps',
      title: 'f3',
      schema: {},
    }, {
      id: 4,
      order: 4,
      fieldType: 'signature',
      title: 'f4',
      schema: {},
    }, {
      id: 5,
      order: 5,
      fieldType: 'image',
      title: 'f5',
      schema: {},
    }, {
      id: 6,
      order: 6,
      fieldType: 'code',
      title: 'f6',
      schema: {},
    }, {
      id: 7,
      order: 7,
      fieldType: 'date',
      title: 'f7',
      schema: {},
    }],
  }],
};

const renderForm = (props, options = {}) => (
  render(
    <DForm
      form={form}
      initialSectionIndex={0}
      answers={[]}
      formikValues={{}}
      formikTouched={{}}
      onSectionNext={() => {}}
      onSubmit={() => {}}
      renderSection={({
        renderFields,
        isValid,
        section,
        moveToNextSection,
        moveToPrevSection,
        submit,
      }) => (
        <div>
          <div data-testid={`section-${section.id}`}>
            {isValid ? 'IS VALID' : 'IS NOT VALID'}
          </div>
          {renderFields()}
          <button
            type="button"
            onClick={moveToNextSection}
            data-testid="move-to-next-section"
          >
            MOVE TO NEXT SECTION
          </button>

          <button
            type="button"
            onClick={moveToPrevSection}
            data-testid="move-to-prev-section"
          >
            MOVE TO PREV SECTION
          </button>

          <button
            type="button"
            onClick={submit}
            data-testid="submit"
          >
            SUBMIT
          </button>
        </div>
      )}
      renderTextField={({
        value,
        field,
        error,
        onFieldChange,
      }) => (
        <div>
          <div data-testid={`field-${field.id}`}>I am a text field</div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={(e) => onFieldChange(e.target.value)}
            value={value || ''}
            readOnly={field.schema.readOnly}
          />
          <div data-testid={`field-error-${field.id}`}>{error}</div>
        </div>
      )}
      renderNumberField={({ field, onFieldChange, inputValue }) => (
        <div>
          <div data-testid={`field-${field.id}`}>I am a number field</div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={(e) => onFieldChange(e.target.value)}
            value={inputValue || ''}
            readOnly={field.schema.readOnly}
          />
        </div>
      )}
      renderGPSField={({ field }) => (
        <div data-testid={`field-${field.id}`}>I am a gps field</div>
      )}
      renderSignatureField={({ field }) => (
        <div data-testid={`field-${field.id}`}>I am a signature field</div>
      )}
      renderImageField={({ field, onSave, value }) => (
        <div>
          <div data-testid={`field-${field.id}`}>I am a image field</div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={() => onSave(options.imageObject())}
            value={value || ''}
          />
        </div>
      )}
      renderCodeField={({ field }) => (
        <div data-testid={`field-${field.id}`}>I am a code field</div>
      )}
      renderDateField={({ field }) => (
        <div data-testid={`field-${field.id}`}>I am a date field</div>
      )}
      renderSelectField={({ field, onFieldChange, value }) => (
        <div>
          <div data-testid={`field-${field.id}`}>I am a select field</div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={() => onFieldChange(options.selectedOptions())}
            value={value || ''}
          />
        </div>
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />,
  )
);

test('renders form section', async () => {
  renderForm({ initialSectionIndex: 1 });
  expect(screen.queryByTestId('field-1')).toHaveTextContent('I am a text field');
  expect(screen.queryByTestId('field-2')).toHaveTextContent('I am a number field');
  expect(screen.queryByTestId('field-3')).toHaveTextContent('I am a gps field');
  expect(screen.queryByTestId('field-4')).toHaveTextContent('I am a signature field');
  expect(screen.queryByTestId('field-5')).toHaveTextContent('I am a image field');
  expect(screen.queryByTestId('field-6')).toHaveTextContent('I am a code field');
  expect(screen.queryByTestId('field-7')).toHaveTextContent('I am a date field');
});

test('move between sections and validate', async () => {
  renderForm({ initialSectionIndex: 0 });
  expect(screen.queryByTestId('field-8')).toHaveTextContent('I am a text field');
  expect(screen.queryByTestId('section-1')).toHaveTextContent('IS VALID');
  userEvent.click(screen.queryByTestId('move-to-next-section'));
  expect(screen.queryByTestId('field-1')).toHaveTextContent('I am a text field');
  userEvent.type(screen.queryByTestId('field-input-1'), 'A');
  await waitFor(() => (
    expect(
      screen.queryByTestId('field-error-1'),
    ).toHaveTextContent('Debe tener mínimo 2 caracteres')
  ));
  await waitFor(() => expect(screen.queryByTestId('section-2')).toHaveTextContent('IS NOT VALID'));
  userEvent.type(screen.queryByTestId('field-input-1'), 'AB');
  await waitFor(() => expect(screen.queryByTestId('field-error-1')).toBeEmptyDOMElement());
  await waitFor(() => expect(screen.queryByTestId('section-2')).toHaveTextContent('IS VALID'));
});

test('values persitance when moving through sections', async () => {
  renderForm({ initialSectionIndex: 0 });
  userEvent.type(screen.queryByTestId('field-input-8'), 'Some text answer 8');
  userEvent.click(screen.queryByTestId('move-to-next-section'));
  userEvent.type(screen.queryByTestId('field-input-1'), 'Some text answer 1');
  userEvent.click(screen.queryByTestId('move-to-prev-section'));
  await waitFor(() => expect(screen.queryByTestId('field-input-8')).toHaveValue('Some text answer 8'));
  userEvent.click(screen.queryByTestId('move-to-next-section'));
  await waitFor(() => expect(screen.queryByTestId('field-input-1')).toHaveValue('Some text answer 1'));
});

test('form submit value map to answers', async () => {
  const onSubmit = jest.fn();
  renderForm({
    initialSectionIndex: 0,
    onSubmit,
  }, {
    imageObject() {
      return {
        uri: 'file://somepath',
        size: 20000,
        type: 'image/png',
      };
    },
    selectedOptions() {
      return ['B', 'C'];
    },
  });
  expect(screen.queryByTestId('field-8')).toHaveTextContent('I am a text field');
  userEvent.type(screen.queryByTestId('field-input-8'), 'Some text answer 8');
  userEvent.type(screen.queryByTestId('field-input-9'), 'just to fire change event on select');
  userEvent.click(screen.queryByTestId('move-to-next-section'));
  userEvent.type(screen.queryByTestId('field-input-1'), 'Some text answer 1');
  userEvent.type(screen.queryByTestId('field-input-2'), '654');
  userEvent.type(screen.queryByTestId('field-input-5'), 'just to fire change event on image');
  userEvent.click(screen.queryByTestId('submit'));
  expect(onSubmit).toHaveBeenCalledWith([
    { fieldId: 1, value: 'Some text answer 1' },
    { fieldId: 2, value: 654 },
    {
      fieldId: 5,
      value: {
        uri: 'file://somepath',
        size: 20000,
        type: 'image/png',
        uploaded: false,
        stored: false,
        fieldType: 'image',
      },
    },
    { fieldId: 8, value: 'Some text answer 8' },
    { fieldId: 9, value: 'B' },
    { fieldId: 9, value: 'C' },
  ]);
});
