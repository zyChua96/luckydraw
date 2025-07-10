const express = require('express');
const db = require('./db'); // your connection
const app = express();
app.use(express.json());

app.post('/draw', async (req, res) => {
  const { userId, giftId } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [rows] = await connection.execute(
      'SELECT winner_user_id FROM gifts WHERE id = ? FOR UPDATE',
      [giftId]
    );

    if (rows[0].winner_user_id !== null) {
      await connection.rollback();
      return res.json({ success: false, message: "Already has a winner." });
    }

    await connection.execute(
      'UPDATE gifts SET winner_user_id = ? WHERE id = ?',
      [userId, giftId]
    );

    await connection.commit();
    res.json({ success: true, message: "You won the gift!" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ success: false, message: "Error", error: err });
  } finally {
    connection.release();
  }
});
