import * as type from 'io-ts';
import { isLeft } from 'fp-ts/Either';

export class VersionModel {
    private constructor(
        public readonly full: string,
        public readonly platform: string,
        public readonly config: string,
        public readonly sku: string,
        public readonly rev: string,
        public readonly build: string,
        public readonly branch: string,
        public readonly version: string,
        public readonly dirty: string,
        public readonly uuid: string
    ) { }

    private static Type = type.type({
        full: type.string,
        platform: type.string,
        config: type.string,
        sku: type.string,
        rev: type.string,
        build: type.string,
        branch: type.string,
        version: type.string,
        dirty: type.string,
        UUID: type.string
    });

    public static FromObject(data: unknown): VersionModel {
        const decoded = VersionModel.Type.decode(data);

        if (isLeft(decoded)) {
            console.log(decoded.left);
            throw new Error('Failed to decode type VersionModel');
        }

        const o = decoded.right;
        return new VersionModel(
            o.full,
            o.platform,
            o.config,
            o.sku,
            o.rev,
            o.build,
            o.branch,
            o.version,
            o.dirty,
            o.UUID
        );
    }
}
