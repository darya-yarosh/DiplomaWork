import RequestHandler from "logic/storage/backend/RequestHandler";

import { ENTITY_TYPES } from "models/Entity";
import Project from "models/Project";

/**
 * Controller of project section from backend.
 */
export default class ProjectController {
    projectsLink: string;

    constructor() {
        this.projectsLink = `http://localhost:8080/api/projects/`;
    }

    /**
     * Send request to create new project.
     * 
     * @param newProject data of new project.
     * 
     * @returns result of request. true if project is created. false if project is not created.
     */
    async create(newProject: any) {
        let requestHandler = new RequestHandler();

        delete newProject.type;

        let src = this.projectsLink;
        const project = await requestHandler.createData(src, newProject);
        return project;
    }

    /**
     * Send request to update project.
     * 
     * @param id id of updating project.
     * @param updatedProject new data of project.
     * 
     * @returns result of request. true if project is updated. false if project is not updated.
     */
    async update(id: string, updatedProject: any) {
        let requestHandler = new RequestHandler();

        delete updatedProject.type;

        let src = this.projectsLink + `${id}`;
        const project = await requestHandler.updateData(src, updatedProject);
        return project;
    }

    /**
     * Send request to remove project.
     * 
     * @param id id of removing project.
     * 
     * @returns result of request. true if project is removed. false if project is not removed.
     */
    async delete(id: string) {
        let requestHandler = new RequestHandler();

        let src = this.projectsLink + `${id}`;
        const project = await requestHandler.deleteData(src);
        return project;
    }

    /**
     * Send request to get project list.
     * 
     * @returns project entity list.
     */
    async getAll() {
        let requestHandler = new RequestHandler();

        let srcMain = this.projectsLink;
        const projectListDefault = await requestHandler.getData(srcMain);

        let size = projectListDefault.totalElements;;
        let srcContent = this.projectsLink + `?size=${size}`;
        const projectListFull = await requestHandler.getData(srcContent);

        projectListFull.content.forEach((project: Project) => {
            project.type = ENTITY_TYPES.project;
            project.shortName = project.name;
        })
        return projectListFull.content;
    }

    /**
     * Send request to get project data.
     * 
     * @param id id of getting project.
     * 
     * @returns project data.
     */
    async get(id: string) {
        let requestHandler = new RequestHandler();

        let src = this.projectsLink + `${id}`;
        const project = await requestHandler.getData(src);

        project.type = ENTITY_TYPES.project;
        project.shortName = project.name;
        return project;
    }
}