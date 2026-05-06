import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Lantern Reader library', () => {
  render(<App />);
  expect(screen.getByText(/Lantern Reader/i)).toBeInTheDocument();
  expect(screen.getByText(/Library/i)).toBeInTheDocument();
});
