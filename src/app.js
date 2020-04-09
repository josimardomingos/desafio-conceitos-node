const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

/* MIDDLEWARES */
function validateID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository id." });
  }

  request.id = id;

  return next();
}
/* MIDDLEWARES - END */

const repositories = [];

/**
 * @title List route
 * @description List all repositories
 * @method GET
 * @url /repositories
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * @title Create route
 * @description Create a repository
 * @method POST
 * @url /repositories
 * @bodyParam title string
 * @bodyParam url string
 * @bodyParam techs array of strings
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

/**
 * @title Update route
 * @description Update a repository
 * @method PUT
 * @url /repositories/:id
 * @param id
 * @bodyParam title string
 * @bodyParam url string
 * @bodyParam techs array of strings
 */
app.put("/repositories/:id", validateID, (request, response) => {
  const { title, url, techs } = request.body;

  const repository = repositories.find((repo) => repo.id === request.id);
  if (!repository) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repository["title"] = title;
  repository["url"] = url;
  repository["techs"] = techs;

  return response.json(repository);
});

/**
 * @title Delete route
 * @description Delete a repository
 * @method DELETE
 * @url /repositories/:id
 * @param id
 */
app.delete("/repositories/:id", validateID, (request, response) => {
  const repositoryIndex = repositories.findIndex(
    (repo) => repo.id === request.id
  );
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

/**
 * @title Like route
 * @description Create a new like for a repository
 * @method POST
 * @url /repositories/:id/like
 * @param id
 */
app.post("/repositories/:id/like", validateID, (request, response) => {
  const repository = repositories.find((repo) => repo.id === request.id);
  if (!repository) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
