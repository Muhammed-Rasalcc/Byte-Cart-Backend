const express = require('express');
const router = express.Router();
const User = require('../users/user.model')
const generateToken = require('../middleware/generateToken');


// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username, password });
        await user.save();
        res.status(201).send({ message: "user registered sucessfully!" })
    } catch (error) {
        console.error("Error on registring user", error)
        res.status(500).send({ message: 'error on regstering user' })

    }
})

//login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "user not found" })
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: "password not match" })
        }
        const token = await generateToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'

        })

        res.status(200).send({
            message: "logged in sucessfully", token, user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession

            }
        })
    } catch (error) {
        console.error("Error logged in user", error)
        res.status(500).send({ message: 'error Login in user' })

    }
})

//logout endpoint
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send({ message: "Logged out sucessfilly" })

})

// delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }
        res.status(200).send({ message: 'User deleted sucessfully' })
    } catch (error) {
        console.error("Error deleting user", error)
        res.status(500).send({ message: 'error deleting user' })
    }
})

//get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role').sort({ createdAt: -1 });
        res.status(200).send(users)
    } catch (error) {
        console.error("Error fetching user", error)
        res.status(500).send({ message: 'error fetching user' })
    }
})

// update user role
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }
        res.status(200).send({ message: 'User role updated sucessfully', user })
    } catch (error) {
        console.error("Error updating user role", error)
        res.status(500).send({ message: 'error updating user role' })
    }
})

//edit or upfdate proflie
router.patch('/edit-profile', async (req, res) => {
    try {
        const { userId, username, profileImage, bio, profession } = req.body;
        if (!userId) {
            return res.status(400).send({ message: 'User Id is required' })
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send({ message: 'User not found' })
        }

        // update profile
        if (username !== undefined) user.username = username;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (bio !== undefined) user.bio = bio;
        if (profession !== undefined) user.profession = profession;

        await user.save();
        res.status(200).send({
            message: 'Profile updated sucessfully', user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession
            },
        });

    } catch (error) {
        console.error("Error upadating user profile", error)
        res.status(500).send({ message: 'error upadating user profile' })
    }
})

module.exports = router;