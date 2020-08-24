const fs = require("fs");
const workspaceRoot = require('app-root-path');

async function routes(fastify, options) {
    try {
        let root_path = workspaceRoot.path.replace(new RegExp(/[\\]/, 'g'), "/");
        let _path = options.path ? `${root_path}/${options.path}` : `${root_path}/controllers`;
        let _path_url = options.path ? options.path : "controllers";
        let _middleware = options.middleware ? require(`${root_path}/${options.middleware}`) : undefined;

        const GetController = (_path) => {
            let Files = fs.readdirSync(_path);
            for (let file in Files) {
                let NameController = `${_path}/${Files[file]}`;
                if (fs.statSync(NameController).isDirectory()) {
                    GetController(NameController);
                } else {
                    let controller = require(`${NameController}`);
                    let url = NameController
                        .replace(`${root_path}/${_path_url}`, "")
                        .replace('.js', "")
                        .replace('index', "")
                        .replace(/\[/g, ":")
                        .replace(/\]/g, "")

                    fastify.route({
                        method: controller.method,
                        url: url,
                        preHandler: async (request, reply) => {
                            if (!_middleware) {
                                return true;
                            }
                            else {
                                return await _middleware.execute(fastify, controller, request, reply);
                            }

                        },
                        handler: async (request, reply) => {
                            return controller.execute(fastify, request, reply);
                        }
                    })

                    console.log(` dir: ${NameController} | url: ${url} | method: ${controller.method}`);
                }
            }
        }

        GetController(_path);
    } catch (err) {
        console.error(err);
    }
}

module.exports = routes;