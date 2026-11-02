console.log("ADMIN JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    const uploadBtn =
        document.getElementById("uploadBtn");

    if (uploadBtn) {
        uploadBtn.addEventListener(
            "click",
            uploadConversation
        );
    }

    loadConversations();
});

async function uploadConversation() {

    const file =
        document.getElementById("file").files[0];

    const title =
        document.getElementById("title").value.trim();

    const level =
        document.getElementById("level").value;

    const message =
        document.getElementById("message");

    if (!file) {

        message.innerHTML =
            "<span class='error'>Vui lòng chọn file DOCX</span>";

        return;
    }

    const fd = new FormData();

    fd.append("title", title);
    fd.append("level", level);
    fd.append("file", file);

    try {

        const res = await fetch(
            "/api/admin/upload",
            {
                method: "POST",
                body: fd
            }
        );

        const data = await res.json();

        if (data.success) {

            message.innerHTML =
                `
                <span class="success">
                    ✅ Upload thành công
                    (${data.total} câu)
                </span>
                `;

            document.getElementById("title").value = "";
            document.getElementById("file").value = "";

            loadConversations();

        } else {

            message.innerHTML =
                `
                <span class="error">
                    ❌ Upload thất bại
                </span>
                `;
        }

    } catch (err) {

        console.error(err);

        message.innerHTML =
            `
            <span class="error">
                ❌ Upload thất bại
            </span>
            `;
    }

}

async function loadConversations() {

    try {

        const res = await fetch(
            "/api/admin/lessons"
        );

        const conversations =
            await res.json();

        const container =
            document.getElementById(
                "conversationList"
            );

        if (!container) return;

        container.innerHTML = "";

        conversations.forEach((item, index) => {

            container.innerHTML +=
                `
                <div class="conversation-card">

                    <h3>
                        Conversation ${index + 1}
                    </h3>

                    <p>
                        ${item.title}
                    </p>

                    <div class="actions">

                        <button
                            onclick="viewConversation(${item.id})"
                        >
                            View
                        </button>

                        <button
                            onclick="deleteConversation(${item.id})"
                        >
                            Delete
                        </button>

                    </div>

                    <div id="detail-${item.id}">
                    </div>

                </div>
                `;
        });

    } catch (err) {

        console.error(err);

    }

}

async function viewConversation(id) {

    try {

        const res =
            await fetch(
                "/api/admin/lesson/" + id
            );

        const data =
            await res.json();

        document.getElementById(
            `detail-${id}`
        ).innerHTML =
            data
                async function viewConversation(id) {

    try {

        const res =
            await fetch(
                "/api/admin/lesson/" + id
            );

        const data =
            await res.json();

        console.log(data);

        document.getElementById(
            `detail-${id}`
        ).innerHTML =

            data.map(item =>

                `
                <div style="
                    padding:6px 0;
                    border-bottom:1px solid #eee;
                ">
                    <b>${item.vocab}</b>
                    -
                    ${item.meaning}
                </div>
                `
            )
            .join("");

    }
    catch (err) {

        console.error(err);

    }

} {

    try {

        const res =
            await fetch(
                "/api/admin/lesson/" + id
            );

        const data =
            await res.json();

        console.log(data);

        document.getElementById(
            `detail-${id}`
        ).innerHTML =

            data.map(
                item =>

                `
                <div>

                    <b>
                    ${item.vocab}
                    </b>

                    -

                    ${item.meaning}

                </div>
                `
            )
            .join("");

    }
    catch(err){

        console.error(err);

    }

}

    } catch (err) {

        console.error(err);

    }

}

async function deleteConversation(id) {

    const confirmDelete =
        confirm("Bạn có chắc muốn xóa?");

    if (!confirmDelete) return;

    try {

        await fetch(
            "/api/admin/lesson/" + id,
            {
                method: "DELETE"
            }
        );

        loadConversations();

    } catch (err) {

        console.error(err);

    }

}   