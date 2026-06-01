const User =require('../models/User');

const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const restaurantId = req.params.restaurantId;

    const isBookmarked = user.bookmarks.includes(restaurantId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        id => id.toString() !== restaurantId
      );
    } else {
      user.bookmarks.push(restaurantId);
    }

    await user.save();

    res.json({
      bookmarks: user.bookmarks,
      isBookmarked: !isBookmarked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('bookmarks');

    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { toggleBookmark, getBookmarks };
