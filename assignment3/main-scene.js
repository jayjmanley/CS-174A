window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),
                         foursubsphere: new Subdivision_Sphere(4),
                         threesubsphere: new Subdivision_Sphere(3),
                          twosubsphere: new (Subdivision_Sphere.prototype.make_flat_shaded_version() )(2),
                          onesubsphere: new (Subdivision_Sphere.prototype.make_flat_shaded_version()) (1)
                       }
        this.submit_shapes( context, shapes );
                                     
                                     // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            ring:     context.get_instance( Ring_Shader  ).material(),
            sun:      context.get_instance( Phong_Shader ).material(Color.of(1,0,0,1), {ambient: 1}),
            ice:  context.get_instance( Phong_Shader ).material(Color.of(190/255, 195/255, 198/255, 1), {ambient: .2}, {diffusivity: 1}),
            swamp: context.get_instance( Phong_Shader ).material(Color.of(37/255, 106/255, 60/255, 1), {ambient: .2}, {diffusivity: .2}, {specularity: 1},),
            muddy: context.get_instance( Phong_Shader ).material(Color.of(169/255, 132/255, 79/255, 1), {ambient: .2}),
            soft: context.get_instance( Phong_Shader ).material(Color.of(68/255, 85/255, 90/255, 1), {ambient: .2}),
            moon: context.get_instance (Phong_Shader).material(Color.of(0,1,0,1))


        // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)
          }

        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];

      }
    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
      }
      draw_solar(graphics_state, model_transform){
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

        let pulse = 2+Math.sin((Math.PI*t*.4)-(Math.PI/2)); //changes the sun's radius, pulsing it.
        var red = 1/2+ (1/2)*Math.sin((Math.PI*t*.4)-(Math.PI/2));
        var blue = 1 - red;

        // we must scale all the axes
        model_transform = Mat4.identity();
        model_transform = model_transform.times( Mat4.scale([pulse, pulse, pulse]));
        // this.planet1 = model_transform;

        // this.shapes.foursubsphere.draw( graphics_state, model_transform, this.materials.sun.override({color:Color.of(red, 0, blue, 1)}));
        this.shapes.foursubsphere.draw(graphics_state, model_transform, this.materials.sun.override({color:Color.of(red, 0, blue, 1)}));
        this.lights = [new Light( Vec.of(0,0,0,1), Color.of(red,0,blue,1), 10**pulse)]; //requirement 2
        model_transform = Mat4.identity();

        let planet1 = Mat4.identity();
        // planet1 = model_transform.times(Mat4.translation([5 * Math.sin(t), 0, 5 * Math.cos(t)]))
        planet1 = model_transform.times(Mat4.rotation(t, Vec.of(0,1,0,0)))
                  .times(Mat4.translation([5,0,0]))
                  .times(Mat4.rotation(t, Vec.of(0,1,0,0)));
        // planet1 = model_transform.times(Mat4.rotation());
        this.shapes.twosubsphere.draw(graphics_state, planet1, this.materials.ice);
        this.planet_1 = planet1;

        let planet2 = Mat4.identity();
        planet2 = model_transform.times(Mat4.rotation(t*.8, Vec.of(0,1,0,0)))
                                  .times(Mat4.translation([8,0,0]))
                                  .times(Mat4.rotation(t*.8, Vec.of(0,1,0,0)));
        // planet2 = model_transform.times(Mat4.rotation());

        if(Math.floor(t%2)== 1){
          this.shapes.threesubsphere.draw(graphics_state, planet2, this.materials.swamp.override({gouraud: 1}));
        } else {
          this.shapes.threesubsphere.draw(graphics_state, planet2, this.materials.swamp);
        }
        this.planet_2 = planet2;


        let planet3 = Mat4.identity();
        planet3 = model_transform.times(Mat4.rotation(t*.6, Vec.of(0,1,0,0)))
                                .times(Mat4.translation([11,0,0]))
                                .times(Mat4.rotation(t*.6, Vec.of(100,100,100,0)));
        // planet3 = model_transform.times(Mat4.rotation())

        this.shapes.foursubsphere.draw(graphics_state, planet3, this.materials.muddy);
        this.planet_3 = planet3;

        let ring = planet3.times(Mat4.scale([1,1, .01]));
        this.shapes.torus2.draw(graphics_state, ring, this.materials.muddy);
        // model_transform = model_transform.times( Mat4.scale([1, 1, .001]));
        // this.shapes.torus2.draw( graphics_state, planet3, this.materials.ring );

        let planet4 = Mat4.identity();
        planet4 = model_transform.times(Mat4.rotation(t*.5, Vec.of(0,1,0,0)))
            .times(Mat4.translation([14,0,0]))
            .times(Mat4.rotation(t*.5, Vec.of(0,1,0,0)));

        this.shapes.foursubsphere.draw(graphics_state, planet4, this.materials.soft);
        this.planet_4 = planet4;

        let moon = planet4;
        moon = planet4.times(Mat4.rotation(t, Vec.of(0,1,0,0)))
            .times(Mat4.translation([2,0,0]))
            .times(Mat4.rotation(t,Vec.of(0,1,0,0)));
        this.shapes.onesubsphere.draw(graphics_state, moon, this.materials.moon);
        this.moon = moon;
        // planet1 = model_transform.times(Mat4.translation([8, 0, 0]));
        // this.planet_1 = planet_1;;
        // planet1 = model_transform.times(Mat4.rotation(t, Vec.of(0,1,0));
        // planet1 = model_transform.times(Mat4.translation([8, 0, 0]));
        // this.planet_1 = planet_1;


        // model_transform = model_transform.times();




      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        let model_transform = Mat4.identity();

        this.draw_solar(graphics_state, model_transform);

        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)
        if(this.attached   != undefined){
          let desired = this.attached().times(Mat4.translation([0,0,5]));
          desired = Mat4.inverse(desired);
          desired = desired.map( (x,i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, .1 ) );
          graphics_state.camera_transform = desired;
        }

        // this.shapes.torus2.draw( graphics_state, Mat4.identity(), this.materials.sun );

      }
  }


// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function, 
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to 
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused. 
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        { 
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return `
        void main()
        { 
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at 
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );
        

                      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
                      //        (Extra Credit Part III)
      } }