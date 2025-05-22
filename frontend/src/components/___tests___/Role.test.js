import React from 'react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Role from '../../dashboard/Roles/Role';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock useTheme hook
jest.mock("../../components/ThemeContext", () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

// Mock navigate
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn().mockReturnValue({ pathname: '/' }),
  useParams: jest.fn(),
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
}));

// Mock child components
jest.mock('../Sidebar', () => () => <div>Sidebar</div>);
jest.mock('../Navbar', () => () => <div>Navbar</div>);

// Mock axios
jest.mock('axios');

describe('Role Component', () => {
  const mockRoles = [
    { id: 1, name: 'Admin', mysqlId: 1 },
    { id: 2, name: 'User', mysqlId: 2 },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockRoles });
    axios.post.mockResolvedValue({ status: 201 });
    axios.put.mockResolvedValue({ status: 200 });
    axios.delete.mockResolvedValue({ status: 200 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders role management title', async () => {
    render(
      <MemoryRouter>
        <Role />
      </MemoryRouter>
    );

    expect(await screen.findByText('Role Management')).toBeInTheDocument();
  });

  it('displays list of roles', async () => {
    render(
      <MemoryRouter>
        <Role />
      </MemoryRouter>
    );

    expect(await screen.findByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  describe('Form Functionality', () => {
    it('adds a new role', async () => {
      render(
        <MemoryRouter>
          <Role />
        </MemoryRouter>
      );

      await userEvent.type(screen.getByPlaceholderText('name'), 'Manager');
      await userEvent.click(screen.getByRole('button', { name: /Shto/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:5001/api/role',
          { name: 'Manager' }
        );
      });
    });

    it('edits an existing role', async () => {
      render(
        <MemoryRouter>
          <Role />
        </MemoryRouter>
      );

      await screen.findByText('Admin');
      const editButtons = screen.getAllByText('Edit');
      await userEvent.click(editButtons[0]);

      expect(screen.getByDisplayValue('Admin')).toBeInTheDocument();

      await userEvent.clear(screen.getByDisplayValue('Admin'));
      await userEvent.type(screen.getByPlaceholderText('name'), 'SuperAdmin');
      await userEvent.click(screen.getByRole('button', { name: /Përditëso/i }));

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          'http://localhost:5001/api/role/1',
          { id: 1, name: 'SuperAdmin', mysqlId: 1 }
        );
      });
    });
  });

 // In your test file, update the delete functionality tests:
describe('Delete Functionality', () => {
  it('shows delete confirmation modal', async () => {
    render(
      <MemoryRouter>
        <Role />
      </MemoryRouter>
    );

    await screen.findByText('Admin');
    const deleteButtons = screen.getAllByText('Delete');
    await userEvent.click(deleteButtons[0]);

    expect(screen.getByText(/Delete Admin\?/i)).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete')).toBeInTheDocument();
  });

  it('deletes role when confirmed', async () => {
    render(
      <MemoryRouter>
        <Role />
      </MemoryRouter>
    );

    await screen.findByText('Admin');
    const deleteButtons = screen.getAllByText('Delete');
    await userEvent.click(deleteButtons[0]);

    await userEvent.click(screen.getByTestId('confirm-delete'));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:5001/api/role/1');
    });
  });
});

  describe('Error Handling', () => {
    it('shows error message when fetch fails', async () => {
      axios.get.mockRejectedValueOnce({
        response: {
          data: { message: 'Failed to fetch roles' },
          status: 500,
        },
      });

      render(
        <MemoryRouter>
          <Role />
        </MemoryRouter>
      );

      expect(await screen.findByText(/Failed to fetch roles|Nuk ka të dhëna/i)).toBeInTheDocument();
    });
  });
});
