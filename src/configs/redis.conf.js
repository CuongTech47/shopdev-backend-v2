const Redis = require("ioredis");

// Tạo một đối tượng Redis và cấu hình kết nối
const redis = new Redis(
  "rediss://default:c449cfece7944df1b3ec8ff333329423@apn1-logical-arachnid-34179.upstash.io:34179"
);

// Xử lý sự kiện khi kết nối thành công
redis.on("connect", () => {
  console.log("Connected to Redis server");
});

// Xử lý sự kiện khi gặp lỗi kết nối
redis.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});
// redis.set("test_key", "test_value", (err, result) => {
//   if (err) {
//     console.error("Error setting value in Redis:", err);
//   } else {
//     console.log("Value set in Redis:", result);
//   }
// });
module.exports = redis;
