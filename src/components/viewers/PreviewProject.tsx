import { Component } from "react";

import Project, { PARAMETERS_PROJECT } from "models/Project";

import RenderConverter from "logic/utils/RenderConverter";

/**
 * Props for renderer of preview project entity.
 * 
 * @param project  project entity.
 */
interface PreviewProjectProps {
    project: Project;
}

/**
 * Renderer of preview entity information about project.
 *
 * @return component with rendered preview entity information about project.
*/
export default class PreviewProject extends Component<PreviewProjectProps> {
    /**
     * Rendering preview information about project.
     * 
     * @return a rendered preview information about project entity.
    */
    render() {
        let project = this.props.project;

        const converterForRender = new RenderConverter();
        const projectName = converterForRender.convert(project.name.toString());
        const projectDescription = converterForRender.convert(project.description.toString());

        return (
            <div className="entityPreview">
                <section className="entityPreviewInfo projectPreview">
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_PROJECT.name}</p>
                        <p className="column-info">{projectName}</p>
                    </section>
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_PROJECT.description}</p>
                        <p className="column-info">{projectDescription}</p>
                    </section>
                </section>
            </div>
        )
    }
}