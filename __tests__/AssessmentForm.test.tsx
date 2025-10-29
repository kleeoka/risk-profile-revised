
/*
  Tests for AssessmentForm component.
  Each test includes comments explaining its purpose.
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AssessmentForm from '../components/AssessmentForm';

test('renders 10 questions', () => {
  render(<AssessmentForm onComplete={()=>{}} />);
  const sliders = screen.getAllByRole('slider');
  expect(sliders.length).toBe(10); // ensure UI shows 10 sliders
});

test('submits and calls onComplete', () => {
  const mock = jest.fn();
  render(<AssessmentForm onComplete={mock} />);
  const sliders = screen.getAllByRole('slider');
  sliders.forEach(s => fireEvent.change(s, { target: { value: 4 } }));
  fireEvent.click(screen.getByText(/See My Profile/i));
  expect(mock).toHaveBeenCalled();
});
