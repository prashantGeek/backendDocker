import TodoEntity from '../entity/TodoEntity.js';

// Create a new Todo for authenticated user
export const createNewList = async (req, res) => {
  try {
    const todoData = {
      ...req.body,
      userId: req.user._id // Add the authenticated user's ID
    };
    const todo = new TodoEntity(todoData);
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Todos for the authenticated user
export const getAllLists = async (req, res) => {
  try {
    const todos = await TodoEntity.find({ userId: req.user._id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single Todo by ID (only if it belongs to the authenticated user)
export const getListById = async (req, res) => {
  try {
    const list = await TodoEntity.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Todo by ID (only if it belongs to the authenticated user)
export const updateList = async (req, res) => {
  try {
    const updatedTodo = await TodoEntity.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Todo by ID (only if it belongs to the authenticated user)
export const deleteList = async (req, res) => {
  try {
    const deletedList = await TodoEntity.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    if (!deletedList) return res.status(404).json({ error: 'List not found' });
    res.status(200).json({ message: 'List deleted successfully ' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
