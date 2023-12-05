use axum::{extract::Path, Extension, Json};

use crate::{
    repo::RepoRef,
    webserver::{self, middleware::User, repos::Repo, Error},
    Application,
};

#[derive(serde::Serialize)]
pub struct ListItem {
    // TODO: Can we remove this in favour of just the `repo_ref`?
    repo: Repo,
    branch: Option<String>,
}

pub async fn list(
    app: Extension<Application>,
    user: Extension<User>,
    Path(project_id): Path<i64>,
) -> webserver::Result<Json<Vec<ListItem>>> {
    let user_id = user
        .username()
        .ok_or_else(webserver::no_user_id)?
        .to_string();

    let list = sqlx::query! {
        "SELECT repo_ref, branch
        FROM project_repos
        WHERE project_id = $1 AND EXISTS (
            SELECT p.id
            FROM projects p
            WHERE p.id = $1 AND p.user_id = $2
        )",
        project_id,
        user_id,
    }
    .fetch_all(&*app.sql)
    .await?
    .into_iter()
    .filter_map(|row| {
        let repo_ref = row.repo_ref.parse().ok()?;
        let entry = app.repo_pool.get(&repo_ref)?;
        let repo = Repo::from((entry.key(), entry.get()));

        Some(ListItem {
            repo,
            branch: row.branch,
        })
    })
    .collect();

    Ok(Json(list))
}

#[derive(serde::Deserialize)]
pub struct Add {
    #[serde(rename = "ref")]
    repo_ref: RepoRef,
    branch: Option<String>,
}

pub async fn add(
    app: Extension<Application>,
    user: Extension<User>,
    Path(project_id): Path<i64>,
    Json(params): Json<Add>,
) -> webserver::Result<()> {
    let user_id = user
        .username()
        .ok_or_else(webserver::no_user_id)?
        .to_string();

    sqlx::query! {
        "SELECT id FROM projects WHERE id = ? AND user_id = ?",
        project_id,
        user_id,
    }
    .fetch_optional(&*app.sql)
    .await?
    .ok_or_else(|| Error::not_found("project not found"))?;

    let repo_ref = params.repo_ref.to_string();

    sqlx::query! {
        "INSERT INTO project_repos (project_id, repo_ref, branch) VALUES ($1, $2, $3)",
        project_id,
        repo_ref,
        params.branch,
    }
    .execute(&*app.sql)
    .await
    .map(|_| ())
    .map_err(Error::internal)
}

pub async fn delete(
    app: Extension<Application>,
    user: Extension<User>,
    Path((project_id, repo_ref)): Path<(i64, String)>,
) -> webserver::Result<()> {
    let user_id = user
        .username()
        .ok_or_else(webserver::no_user_id)?
        .to_string();

    sqlx::query! {
        "DELETE FROM project_repos
        WHERE project_id = $1 AND repo_ref = $2 AND EXISTS (
            SELECT id
            FROM projects
            WHERE id = $1 AND user_id = $3
        )
        RETURNING id",
        project_id,
        repo_ref,
        user_id,
    }
    .fetch_optional(&*app.sql)
    .await?
    .map(|_| ())
    .ok_or_else(|| Error::not_found("project repo not found"))
}
