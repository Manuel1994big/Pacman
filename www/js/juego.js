var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    cont = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },
  //var spacefield;
  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      //game.stage.backgroundColor = '#00528c';
      game.load.image('background', 'assets/space.png');
      game.load.image('bola', 'assets/PacMan.png');
      game.load.image('objetivo1', 'assets/objetivo1.png');
      game.load.image('objetivo2', 'assets/objetivo2.png');
    }

    function create() {
      
      spacefield = game.add.tileSprite(0,0,1080,1920,'background');  
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '60px', fill: '#0110ff' });
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo1');
      objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
      game.physics.arcade.enable(objetivo2);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacionBorde, this);
      objetivo.body.collideWorldBounds = true;
      objetivo.body.onWorldBounds = new Phaser.Signal();
      objetivo.body.onWorldBounds.add(app.changeposition, this);
    }

    function update(){
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      game.physics.arcade.overlap(bola, objetivo, app.decrementaPuntuacionMala, null, this);
      game.physics.arcade.overlap(bola, objetivo2, app.incrementaPuntuacion, null, this);
      spacefield.tilePosition.y +=2;
      objetivo.body.y +=2;
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacionBorde: function(){
    cont=cont+1;
    if(cont >= 10){
      puntuacion = puntuacion-1;
      cont=0;
    }
    scoreText.text = puntuacion;
    
    if (puntuacion < 0){
        setTimeout(app.recomienza, 1000);
    }
    
        
  },
  decrementaPuntuacionMala: function(){
    puntuacion = puntuacion-5;
    scoreText.text = puntuacion;
    
    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY(); 
    
    if (puntuacion < 0){
        setTimeout(app.recomienza, 1000);
    }
        
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+7;
    scoreText.text = puntuacion;

    objetivo2.body.x = app.inicioX();
    objetivo2.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
  },
    
  changeposition: function(){
     objetivo.body.x = app.inicioX();
     objetivo.body.y = app.inicioY(); 
  },
    

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}