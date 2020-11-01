import Entity from "./entity";
import { uncapitalize } from "./utils";
import JavaClass from "./def/JavaClass";

export default class Repository extends JavaClass {
	private readonly _entity: Entity;
	private readonly _className: string;

	constructor(entity: Entity, domain: string) {
		super(domain, "repository");
		super.imports = [
			"org.springframework.data.jpa.repository.JpaRepository",
			"org.springframework.stereotype.Repository",
			`${domain ? domain + "." : ""}entity.${entity.className}`,
		];
		super.annotations = [
			"Repository",
		];
		super.superClasses = [
			`JpaRepository<${entity.className}, ${entity.columns.find(c => c.primaryKey)!.javaType}>`
		]
		super.type = "interface";
		super.lombok = true;

		this._entity = entity;
		this._className = entity.className + "Repository";
	}

	public get className(): string {
		return this._className;
	}

	public get varName(): string {
		return uncapitalize(this._className);
	}

	public get code(): string {
		return this.wrap();
	}

	get entity(): Entity {
		return this._entity;
	}
}


module.exports = Repository;
