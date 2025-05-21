import React from 'react'; // Add this line
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Program from '../../dashboard/Program';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// ✅ Then declare mocks and variables
const mockNavigate = jest.fn();
// Mock the react-router-dom properly
// Update this mock at the top of your file
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // Use the mockNavigate we defined
}));

// Mock child components
jest.mock('../Sidebar', () => () => <div>Sidebar</div>);
jest.mock('../Navbar', () => () => <div>Navbar</div>);
jest.mock('../DeleteConfirmation', () => ({ isOpen, onConfirm, itemName }) =>
  isOpen ? (
    <div>
      Delete {itemName}? <button onClick={onConfirm}>Confirm</button>
    </div>
  ) : null
);

// Mock axios
jest.mock('axios');

describe('Program Component', () => {
  const mockUser = { id: 1, name: 'Test User' };
  const mockPrograms = [
    { id: 1, mysqlId: '1', title: 'Program 1', description: 'Desc 1', createdAt: '2023-01-01', createdById: mockUser },
    { id: 2, mysqlId: '2', title: 'Program 2', description: 'Desc 2', createdAt: '2023-01-02', createdById: mockUser },
  ];

  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:5001/user') {
        return Promise.resolve({ data: { user: mockUser } });
      }
      if (url === 'http://localhost:5001/api/program') {
        return Promise.resolve({ data: mockPrograms });
      }
      return Promise.reject(new Error('Not mocked'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
   it('renders program management title', async () => {
    render(
      <MemoryRouter>
        <Program />
      </MemoryRouter>
    );
    expect(await screen.findByText('Program Management')).toBeInTheDocument();
  });
it('displays the list of programs', async () => {
  render(
    <MemoryRouter>
      <Program />
    </MemoryRouter>
  );

  expect(await screen.findByText('Program 1')).toBeInTheDocument();
  expect(screen.getByText('Desc 1')).toBeInTheDocument();
  // Change to getAllByText since there are multiple Test User cells
  expect(screen.getAllByText('Test User').length).toBeGreaterThan(0);
});
  describe('Form Functionality', () => {
    it('allows adding a new program', async () => {
      axios.post.mockResolvedValue({ status: 201 });

      render(
        <MemoryRouter>
          <Program />
        </MemoryRouter>
      );

      await userEvent.type(screen.getByPlaceholderText('title'), 'New Program');
      await userEvent.type(screen.getByPlaceholderText('description'), 'New Description');
      await userEvent.click(screen.getByRole('button', { name: /Shto/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:5001/api/program',
          expect.objectContaining({
            title: 'New Program',
            description: 'New Description',
            createdById: mockUser.id,
          })
        );
      });
    });

    it('allows editing an existing program', async () => {
      axios.put.mockResolvedValue({ status: 200 });

      render(
        <MemoryRouter>
          <Program />
        </MemoryRouter>
      );

      await screen.findByText('Program 1');
      const editButtons = screen.getAllByText('Edit');
      await userEvent.click(editButtons[0]);

      expect(screen.getByDisplayValue('Program 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Desc 1')).toBeInTheDocument();
      expect(screen.getByText('Përditëso')).toBeInTheDocument();

      await userEvent.clear(screen.getByDisplayValue('Program 1'));
      await userEvent.type(screen.getByPlaceholderText('title'), 'Updated Program');
      await userEvent.click(screen.getByText('Përditëso'));

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          'http://localhost:5001/api/program/1',
          expect.objectContaining({
            title: 'Updated Program',
            id: '1',
          })
        );
      });
    });
  });

  describe('Delete Functionality', () => {
    it('shows delete confirmation modal', async () => {
      render(
        <MemoryRouter>
          <Program />
        </MemoryRouter>
      );

      await screen.findByText('Program 1');
      const deleteButtons = screen.getAllByText('Delete');
      await userEvent.click(deleteButtons[0]);

      expect(screen.getByText(/Delete Program 1/i)).toBeInTheDocument();
    });

    it('deletes program when confirmed', async () => {
      axios.delete.mockResolvedValue({ status: 200 });

      render(
        <MemoryRouter>
          <Program />
        </MemoryRouter>
      );

      await screen.findByText('Program 1');
      const deleteButtons = screen.getAllByText('Delete');
      await userEvent.click(deleteButtons[0]);
      await userEvent.click(screen.getByText('Confirm'));

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith('http://localhost:5001/api/program/1', {
          data: { userId: mockUser.id },
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('handles unauthorized access', async () => {
      axios.get.mockImplementationOnce(() => Promise.reject({ response: { status: 401 } }));

      render(
        <MemoryRouter>
          <Program />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('shows error when program fetch fails', async () => {
      axios.get.mockImplementationOnce((url) =>
        url.includes('/api/program')
          ? Promise.reject(new Error('Network Error'))
          : Promise.resolve({ data: { user: mockUser } })
      );

      render(
        <MemoryRouter>
          <Program />
        </MemoryRouter>
      );

      expect(await screen.findByText(/Nuk ka të dhëna/i)).toBeInTheDocument();
    });
  });
});
