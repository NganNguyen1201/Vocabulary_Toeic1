const express = require("express");
const router = express.Router();

const multer = require("multer");
const parseExcel =
    require("../services/excelParser");

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/upload",
    upload.single("file"),
    async (req, res) => {

        try {

            const db =
                req.app.locals.db;

            const title =
                req.body.title || "Untitled";

            const rows =
                parseExcel(req.file.path);

            console.log("ROWS =", rows);

            db.run(
                `
                INSERT INTO lessons(title)
                VALUES(?)
                `,
                [title],
                function (err) {

                    if (err) {

                        console.error(err);

                        return res
                            .status(500)
                            .json(err);

                    }

                    const lessonId =
                        this.lastID;

                    const stmt =
                        db.prepare(
                            `
                            INSERT INTO sentences
                            (
                                lesson_id,
                                content
                            )
                            VALUES (?,?)
                            `
                        );

                    rows.forEach(row => {

                        console.log(
                            "ROW =",
                            row
                        );

                        const keys =
                            Object.keys(row);

                        console.log(
                            "KEYS =",
                            keys
                        );

                        let vocab =
                            row.Vocab ||
                            row.VOCAB ||
                            row.vocab ||
                            row.Word ||
                            row.word ||
                            row["Từ vựng"] ||
                            row["Vocabulary"];

                        let meaning =
                            row.Meaning ||
                            row.MEANING ||
                            row.meaning ||
                            row.Nghia ||
                            row["Nghĩa"] ||
                            row["Meaning"];

                        // Nếu vẫn chưa lấy được
                        // thì tự lấy theo vị trí cột

                        if (!vocab && keys.length >= 2) {
                            vocab =
                                row[keys[1]];
                        }

                        if (!meaning && keys.length >= 3) {
                            meaning =
                                row[keys[2]];
                        }

                        console.log(
                            "VOCAB =",
                            vocab
                        );

                        console.log(
                            "MEANING =",
                            meaning
                        );

                        if (
                            !vocab ||
                            !meaning
                        ) {
                            return;
                        }

                        stmt.run(
                            lessonId,
                            JSON.stringify({
                                vocab:
                                    String(vocab).trim(),
                                meaning:
                                    String(meaning).trim()
                            })
                        );

                    });

                    stmt.finalize();

                    res.json({
                        success: true,
                        total: rows.length
                    });

                }
            );

        }
        catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    }
);

router.get(
    "/lessons",
    (req, res) => {

        const db =
            req.app.locals.db;

        db.all(
            `
            SELECT *
            FROM lessons
            ORDER BY id DESC
            `,
            [],
            (err, rows) => {

                if (err) {
                    return res
                        .status(500)
                        .json(err);
                }

                res.json(rows);

            }
        );

    }
);

router.get(
    "/lesson/:id",
    (req, res) => {

        const db =
            req.app.locals.db;

        db.all(
            `
            SELECT *
            FROM sentences
            WHERE lesson_id=?
            `,
            [req.params.id],
            (err, rows) => {

                if (err) {
                    return res
                        .status(500)
                        .json(err);
                }

                const result =
                    rows.map(row => {

                        try {

                            return JSON.parse(
                                row.content
                            );

                        } catch {

                            return {};

                        }

                    });

                res.json(result);

            }
        );

    }
);

router.delete(
    "/lesson/:id",
    (req, res) => {

        const db =
            req.app.locals.db;

        db.run(
            `
            DELETE FROM sentences
            WHERE lesson_id=?
            `,
            [req.params.id]
        );

        db.run(
            `
            DELETE FROM lessons
            WHERE id=?
            `,
            [req.params.id],
            () => {

                res.json({
                    success: true
                });

            }
        );

    }
);

module.exports = router;