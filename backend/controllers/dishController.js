const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');

const createDish = async (req, res) => {
  try {
    const { name, description, ingredients, flavor, weight, price,image } = req.body;
    const restaurantId = req.params.restaurantId;

    if (!name) {
      return res.status(400).json({ message: 'Dish name is required' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const dish = await Dish.create({
      name,
      description,
      ingredients,
      flavor,
      weight,
      price,
      image,
      restaurant: restaurantId,
      createdBy: req.user._id
    });

    res.status(201).json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDishesByRestaurant = async (req, res) => {
  try {
    const dishes = await Dish.find({ restaurant: req.params.restaurantId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('restaurant', 'name city');

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    if (dish.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await dish.deleteOne();
    res.json({ message: 'Dish deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDish, getDishesByRestaurant, getDishById, deleteDish };