// jest.global-setup.js

module.exports = async () => {
  process.env.TZ = "UTC"; // Set the desired time zone
};
