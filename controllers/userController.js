import authEntity from '../entity/authEntity.js';

// Get current authenticated user's profile
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the authenticateToken middleware
    const user = await authEntity.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users (admin function - you might want to restrict this)
export const getUsers = async (req, res) => {
  try {
    const users = await authEntity.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new user (this should probably redirect to auth/register)
export const createNewUsers = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await authEntity.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = new authEntity({ username, email, password });
    await newUser.save();
    
    // Return user without password
    const userResponse = await authEntity.findById(newUser._id).select('-password');
    res.status(201).json({ 
      message: 'User created successfully', 
      user: userResponse 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await authEntity.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is trying to delete themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const deletedUser = await authEntity.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ message: `User ${deletedUser.username} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    
    // Only allow users to update their own profile or admin functionality
    if (req.user._id.toString() !== id) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    const updatedUser = await authEntity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'User updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};