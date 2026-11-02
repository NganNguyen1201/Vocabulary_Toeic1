const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {

    const db = req.app.locals.db;

    db.all(
        `
        SELECT
            lessons.id,
            lessons.title,
            COUNT(sentences.id) AS totalParts
        FROM lessons
        LEFT JOIN sentences
            ON lessons.id = sentences.lesson_id
        GROUP BY lessons.id
        ORDER BY lessons.id DESC
        `,
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }
    );

});

router.get("/:id", (req, res) => {

    const db = req.app.locals.db;

    db.all(
        `
        SELECT *
        FROM sentences
        WHERE lesson_id = ?
        `,
        [req.params.id],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            const result = rows.map(row => {

                try {
                    return JSON.parse(row.content);
                }
                catch {

                    return {
                        vocab: "",
                        meaning: ""
                    };

                }

            });

            res.json(result);

        }
    );

});

module.exports = router;