import EventEmitter from './EventEmitter.js'

import {
    GLTFLoader
} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js'

import {
    FBXLoader
} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/FBXLoader.js'

import {
    DRACOLoader
} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/DRACOLoader.js'


export default class Loader
    extends EventEmitter
{

    constructor()
    {
        super()

        this.loaders = []

        this.toLoad = 0

        this.loaded = 0

        this.items = {}

        this.setLoaders()
    }


    /*
    |--------------------------------------------------------------------------
    | LOADERS
    |--------------------------------------------------------------------------
    */

    setLoaders()
    {
        /*
        |--------------------------------------------------------------------------
        | IMAGE
        |--------------------------------------------------------------------------
        */

        this.loaders.push({

            extensions:
            [
                'jpg',
                'jpeg',
                'png',
                'webp'
            ],

            action: (resource) =>
            {
                const image =
                    new Image()


                image.onload =
                    () =>
                    {
                        console.log(
                            '✅ IMAGE:',
                            resource.source
                        )


                        this.fileLoadEnd(
                            resource,
                            image
                        )
                    }


                image.onerror =
                    (error) =>
                    {
                        console.error(
                            '❌ IMAGE ERROR:',
                            resource.source,
                            error
                        )


                        this.fileLoadEnd(
                            resource,
                            null
                        )
                    }


                image.src =
                    resource.source
            }

        })


        /*
        |--------------------------------------------------------------------------
        | DRACO
        |--------------------------------------------------------------------------
        */

        const dracoLoader =
            new DRACOLoader()


        dracoLoader.setDecoderPath(
            'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/libs/draco/'
        )


        /*
        |--------------------------------------------------------------------------
        | GLTF
        |--------------------------------------------------------------------------
        */

        const gltfLoader =
            new GLTFLoader()


        gltfLoader.setDRACOLoader(
            dracoLoader
        )


        this.loaders.push({

            extensions:
            [
                'glb',
                'gltf'
            ],

            action: (resource) =>
            {
                console.log(
                    '📦 GLTF/GLB:',
                    resource.source
                )


                gltfLoader.load(

                    resource.source,

                    (data) =>
                    {
                        console.log(
                            '✅ GLB LOADED:',
                            resource.source
                        )


                        this.fileLoadEnd(
                            resource,
                            data
                        )
                    },


                    (progress) =>
                    {
                        if(
                            progress.total > 0
                        )
                        {
                            const percent =
                                Math.round(
                                    (
                                        progress.loaded /
                                        progress.total
                                    ) * 100
                                )


                            console.log(
                                `🚗 ${resource.name}: ${percent}%`
                            )
                        }
                    },


                    (error) =>
                    {
                        console.error(
                            '❌ GLB ERROR:',
                            resource.source
                        )


                        console.error(
                            error
                        )


                        this.fileLoadEnd(
                            resource,
                            null
                        )
                    }

                )
            }

        })


        /*
        |--------------------------------------------------------------------------
        | FBX
        |--------------------------------------------------------------------------
        */

        const fbxLoader =
            new FBXLoader()


        this.loaders.push({

            extensions:
            [
                'fbx'
            ],

            action: (resource) =>
            {
                console.log(
                    '📦 FBX:',
                    resource.source
                )


                fbxLoader.load(

                    resource.source,

                    (data) =>
                    {
                        console.log(
                            '✅ FBX LOADED:',
                            resource.source
                        )


                        this.fileLoadEnd(
                            resource,
                            data
                        )
                    },


                    undefined,


                    (error) =>
                    {
                        console.error(
                            '❌ FBX ERROR:',
                            resource.source
                        )


                        console.error(
                            error
                        )


                        this.fileLoadEnd(
                            resource,
                            null
                        )
                    }

                )
            }

        })
    }


    /*
    |--------------------------------------------------------------------------
    | LOAD
    |--------------------------------------------------------------------------
    */

    load(
        resources = []
    )
    {
        this.toLoad =
            resources.length


        this.loaded =
            0


        this.items =
            {}


        console.log(
            '======================================'
        )


        console.log(
            `📦 RESOURCES: ${this.toLoad}`
        )


        console.log(
            '======================================'
        )


        if(
            this.toLoad === 0
        )
        {
            this.trigger(
                'end'
            )

            return
        }


        for(
            const resource
            of resources
        )
        {
            this.loadResource(
                resource
            )
        }
    }


    /*
    |--------------------------------------------------------------------------
    | LOAD RESOURCE
    |--------------------------------------------------------------------------
    */

    loadResource(
        resource
    )
    {
        if(
            !resource ||
            !resource.source
        )
        {
            console.error(
                '❌ INVALID RESOURCE:',
                resource
            )


            this.fileLoadEnd(
                resource,
                null
            )


            return
        }


        /*
        |--------------------------------------------------------------------------
        | EXTENSION
        |--------------------------------------------------------------------------
        */

        const cleanSource =
            resource.source
                .split('?')[0]
                .split('#')[0]


        const extensionMatch =
            cleanSource.match(
                /\.([a-z0-9]+)$/i
            )


        if(
            !extensionMatch
        )
        {
            console.error(
                '❌ NO EXTENSION:',
                resource.source
            )


            this.fileLoadEnd(
                resource,
                null
            )


            return
        }


        const extension =
            extensionMatch[1]
                .toLowerCase()


        /*
        |--------------------------------------------------------------------------
        | FIND LOADER
        |--------------------------------------------------------------------------
        */

        const loader =
            this.loaders.find(
                (_loader) =>
                {
                    return _loader.extensions.includes(
                        extension
                    )
                }
            )


        if(
            !loader
        )
        {
            console.error(
                '❌ NO LOADER FOR:',
                extension,
                resource.source
            )


            this.fileLoadEnd(
                resource,
                null
            )


            return
        }


        /*
        |--------------------------------------------------------------------------
        | START
        |--------------------------------------------------------------------------
        */

        try
        {
            loader.action(
                resource
            )
        }
        catch(error)
        {
            console.error(
                '❌ LOADER EXCEPTION:',
                resource.source
            )


            console.error(
                error
            )


            this.fileLoadEnd(
                resource,
                null
            )
        }
    }


    /*
    |--------------------------------------------------------------------------
    | FILE END
    |--------------------------------------------------------------------------
    */

    fileLoadEnd(
        resource,
        data
    )
    {
        this.loaded++


        /*
        |--------------------------------------------------------------------------
        | SAVE
        |--------------------------------------------------------------------------
        */

        if(
            resource &&
            resource.name
        )
        {
            this.items[
                resource.name
            ] =
                data
        }


        /*
        |--------------------------------------------------------------------------
        | EVENT
        |--------------------------------------------------------------------------
        */

        this.trigger(
            'fileEnd',
            [
                resource,
                data
            ]
        )


        /*
        |--------------------------------------------------------------------------
        | PROGRESS
        |--------------------------------------------------------------------------
        */

        const progress =
            this.toLoad > 0
                ? this.loaded /
                  this.toLoad
                : 1


        console.log(
            `📦 LOADING ${this.loaded}/${this.toLoad}`,
            resource?.name
        )


        /*
        |--------------------------------------------------------------------------
        | COMPLETE
        |--------------------------------------------------------------------------
        */

        if(
            this.loaded >=
            this.toLoad
        )
        {
            console.log(
                '======================================'
            )


            console.log(
                '✅ ALL RESOURCES LOADED'
            )


            console.log(
                '======================================'
            )


            this.trigger(
                'end'
            )
        }
    }

}