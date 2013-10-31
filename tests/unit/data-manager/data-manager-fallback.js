( function( $ ) {

    //A Little Bit of setup
    //Remove the indexedDB and webSQL adapters from our list of valid adapters
    // so we can show the fallback to sessionLocal.
    //but first lets save a reference
    var validAdapters = AeroGear.DataManagerCore.adapters;

    module( "DataManager Creation with fallbacks", {
        setup: function() {

            for( var adapter in AeroGear.DataManagerCore.adapters ) {
                if( adapter === "IndexedDB" || adapter === "WebSQL") {
                    delete AeroGear.DataManagerCore.adapters[ adapter ];
                }
            }
        },
        teardown: function() {
            AeroGear.DataManagerCore.adapters = validAdapters;
        }
    });

    test( "create IndexedDB - Fallsback to SessionLocal - name string", function() {
        expect( 4 );

        var dm = AeroGear.DataManager( { name: "createTest1", type: "IndexedDB" } ).stores;
        equal( Object.keys( dm ).length, 1, "Single Store created" );
        equal( Object.keys( dm )[ 0 ], "createTest1", "Store Name createTest1" );
        equal( dm.createTest1 instanceof AeroGear.DataManager.adapters.SessionLocal, true, "Fellback to SessionLocal" );
        equal( dm.createTest1.getAsync(), true, "SessionLocal should be in async mode since it fellback" );
    });

    test( "create IndexedDB and WebSQL - Fallsback to SessionLocal - name array", function() {
        expect( 10 );

        var dm = AeroGear.DataManager([
            {
                name: "createTest21",
                type: "WebSQL"
            },
            {
                name: "createTest22",
                type: "IndexedDB"
            },
            "createTest23"
        ]).stores;

        equal( Object.keys( dm ).length, 3, "3 Stores created" );
        equal( Object.keys( dm )[ 0 ], "createTest21", "Store Name createTest21" );
        equal( Object.keys( dm )[ 1 ], "createTest22", "Store Name createTest22" );
        equal( Object.keys( dm )[ 2 ], "createTest23", "Store Name createTest23" );
        equal( dm.createTest21 instanceof AeroGear.DataManager.adapters.SessionLocal, true, "Fellback to SessionLocal" );
        equal( dm.createTest22 instanceof AeroGear.DataManager.adapters.SessionLocal, true, "Fellback to SessionLocal" );
        equal( dm.createTest21.getAsync(), true, "SessionLocal should be in async mode since it fellback" );
        equal( dm.createTest22.getAsync(), true, "SessionLocal should be in async mode since it fellback" );
        equal( dm.createTest23 instanceof AeroGear.DataManager.adapters.Memory, true, "No Fallback should happen" );
        equal( dm.createTest23.getAsync(), false, "Memory should be in sync mode" );
    });

    test( "create - object", function() {
        expect( 7 );

        var dm = AeroGear.DataManager([
            {
                name: "createTest31"
            },
            {
                name: "createTest32",
                type: "WebSQL"
            }
        ]).stores;

        equal( Object.keys( dm ).length, 2, "2 Stores created" );
        equal( Object.keys( dm )[ 0 ], "createTest31", "Store Name createTest31" );
        equal( Object.keys( dm )[ 1 ], "createTest32", "Store Name createTest32" );
        equal( dm.createTest31 instanceof AeroGear.DataManager.adapters.Memory, true, "No Fallback should happen" );
        equal( dm.createTest31.getAsync(), false, "Memory should be in sync mode" );
        equal( dm.createTest32 instanceof AeroGear.DataManager.adapters.SessionLocal, true, "Fellback to SessionLocal" );
        equal( dm.createTest32.getAsync(), true, "SessionLocal should be in async mode since it fellback" );
    });
})( jQuery );
