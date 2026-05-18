const Restaurant = require('../models/Restaurant');

const createRestaurant = async (req, res) => {
  try {
    const { name, description, cuisine, area, city, image } = req.body;

    if (!name || !cuisine || !area || !city) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      cuisine,
      area,
      city,
      image,
      createdBy: req.user._id
    });

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const { search, cuisine, city, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Restaurant.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));

    const restaurants = await Restaurant.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      restaurants,
      currentPage: Number(page),
      totalPages,
      totalRestaurants: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await restaurant.deleteOne();
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getTrending = async (req, res) => {
  try {
    const Review = require('../models/Review');

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingDishes = await Review.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$dish', reviewCount: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
      { $sort: { reviewCount: -1, avgRating: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'dishes', localField: '_id', foreignField: '_id', as: 'dish' } },
      { $unwind: '$dish' },
      { $lookup: { from: 'restaurants', localField: 'dish.restaurant', foreignField: '_id', as: 'restaurant' } },
      { $unwind: '$restaurant' }
    ]);

    res.json(trendingDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { createRestaurant, getRestaurants, getRestaurantById, deleteRestaurant, getTrending };