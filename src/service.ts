import Entity from "./entity";
import { snakeToCamel, uncapitalize, formatImports, capitalize, plural } from "./utils";


export default class Service {
	private readonly _entity: Entity;
	private readonly _domain: string;

	constructor(entity: Entity, domain: string) {
		this._domain = domain;
		this._entity = entity;
	}

	public get code(): string {
		const className = this._entity.className;
		const varname = uncapitalize(className);
		const primaryKeys = this.entity.primaryKeyList;

		const imports = [
			`${this._domain}.entity.*`,
			`java.util.List`,
		];

		let out = "";
		out += `${this.packageName}\n\n`;
		out += formatImports(imports);
		out += `public interface ${this.className} {\n\n`;
		out += `\tList<${className}> findAll();\n\n`;

		out += `\t${className} save(${className} ${varname});\n\n`;

		out += `\t${className} update(${className} ${varname});\n\n`;

		out += `\t${className} findById(${this.primaryKeyList.join(", ")});\n`;

		out += `\n\tvoid deleteById(${this.primaryKeyList.join(", ")});\n`;

		this.entity.mtmColumns.forEach(col => {
			out += `\n\tList<${col.targetClassName}> findAll${plural(col.targetClassName)}By${primaryKeys.map(key => `${capitalize(key.varName)}`).join("And")}(${primaryKeys.map(key => `${key.javaType} ${key.varName}`).join(", ")});\n`;
			// out += `\n\tList<${col.className}> findAllBy${capitalize(col.targetVarName)}(${""});\n`;
		});

		out += "\n}\n";
		return out;
	}

	public get className(): string {
		return this._entity.className + "Service";
	}

	public get packageName(): string {
		if (!this._domain) return "package service;";
		return `package ${this._domain}.service;`;
	}

	private get primaryKeyList() {
		return this._entity.columns.filter(c => c.primaryKey).map(c => `${c.javaType} ${snakeToCamel(c.name)}`);
	}

	get entity(): Entity {
		return this._entity;
	}

	get domain(): string {
		return this._domain;
	}
}

