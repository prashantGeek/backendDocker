import TodoEntity from '../entity/TodoEntity.js';

// Create a new Todo
export const createNewList = async (req, res) => {
  try {
    const todo = new TodoEntity(req.body);
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Todos
export const getAllLists = async (req, res) => {
  try {
    const todos = await TodoEntity.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single Todo by ID
export const getListById = async (req, res) => {
  try {
    const list = await TodoEntity.findById(req.params.id);
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Todo by ID
export const updateList = async (req, res) => {
  try {
    const updatedTodo = await TodoEntity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Todo by ID
export const deleteList = async (req, res) => {
  try {
    const deletedList = await TodoEntity.findByIdAndDelete(req.params.id);
    if (!deletedList) return res.status(404).json({ error: 'List not found' });
    res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
