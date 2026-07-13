import { jest } from '@jest/globals';

const mockUserRepository = {
  getByEmail: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
};

jest.unstable_mockModule('../../repository/users.repository.js', () => ({
  usersRepository: mockUserRepository,
}));

const { usersService } = await import('../../services/usersService.js');

describe('userService.create', () => {
  it('should throw if username not provide', async () => {
    await expect(usersService.findById()).rejects.toThrow(
      'id params not provided',
    );
  });
});
