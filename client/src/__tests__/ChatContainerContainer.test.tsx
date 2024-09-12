import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChatContainer from '../containers/ChatContainer'; 

describe('ChatContainer', () => {
  it('renders correctly and handles user input and send action', () => {
    render(<ChatContainer />);

    const input = screen.getByPlaceholderText('Type your message here...') as HTMLInputElement;
    const button = screen.getByText('Send');

    expect(screen.getByText('Explore Your Metrics: Ask Me How!')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');

    fireEvent.click(button);

    expect(input.value).toBe('');
    
  });
});