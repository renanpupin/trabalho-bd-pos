# Adicionando pontos

## Pruden Shopping
```
db.locais.insert({
  nome: "Pruden Shopping",
  localizacao: { type: "Point", coordinates: [-51.408682663524246, -22.115842077820343] }
})
```

## Unesp
```
db.locais.insert({
  nome: "Unesp",
  localizacao: { type: "Point", coordinates: [-51.407948312724386, -22.12119306965996] }
})
```

## Museu
```
db.locais.insert({
  nome: "Museu",
  localizacao: { type: "Point", coordinates: [-51.41174038180122, -22.11696523202623] }
})
```

## Sesc
```
db.locais.insert({
  nome: "Sesc",
  localizacao: { type: "Point", coordinates: [-51.41418803946715, -22.12053401226615] }
})
```

## Avenida Manuel Goulart
```
db.locais.insert({
  nome: "Avenida Manuel Goulart",
  localizacao: {
    type: "Polygon",
    coordinates: [
       [
         [
           -51.384429931640625,
           -22.127070345658982
         ],
         [
           -51.403956413269036,
           -22.117807204917316
         ],
         [
           -51.408247947692864,
           -22.115819327142624
         ],
         [
           -51.41206741333008,
           -22.115739811448652
         ],
         [
           -51.41404151916504,
           -22.116455451080096
         ],
         [
           -51.427388191223145,
           -22.1261559854583
         ],
         [
           -51.4264440536499,
           -22.127070345658982
         ],
         [
           -51.41296863555908,
           -22.117012057170943
         ],
         [
           -51.41178846359253,
           -22.117648175726828
         ],
         [
           -51.4089560508728,
           -22.117230723248273
         ],
         [
           -51.408226490020745,
           -22.116793390754477
         ],
         [
           -51.38455867767333,
           -22.127825682219232
         ],
         [
           -51.384429931640625,
           -22.127070345658982
         ]
       ]
    ]
  }
})
```

# Criando o índice esférico
```
db.locais.createIndex({ localizacao: "2dsphere" })
```

# Operações com GeoJSON

## Verificando pontos próximos com $near

### Quais pontos estão a 10 metros de distância do Pruden Shopping?
```
db.locais.find({
    localizacao: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [-51.4086826635242, -22.1158420778203]
            },  //PrudenShopping
            $maxDistance: 10    //10 metros
        }
    }
}, { nome: 1 })	//busca apenas o campo nome
```

### Quais pontos estão a 400 metros de distância do Pruden Shopping?
```
db.locais.find({
    localizacao: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [-51.4086826635242, -22.1158420778203]
            },  //PrudenShopping
            $maxDistance: 400    //400 metros
        }
    }
}, { nome: 1 })	//busca apenas o campo nome
```

### Quais pontos estão a 700 metros de distância do Pruden Shopping?
```
db.locais.find({
    localizacao: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [-51.4086826635242, -22.1158420778203]
            },  //PrudenShopping
            $maxDistance: 700    //700 metros
        }
    }
}, { nome: 1 })	//busca apenas o campo nome
```

### Quais pontos estão a 1000 metros de distância do Pruden Shopping?
```
db.locais.find({
    localizacao: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [-51.4086826635242, -22.1158420778203]
            },  //PrudenShopping
            $maxDistance: 1000    //1000 metros
        }
    }
}, { nome: 1 })	//busca apenas o campo nome
```

## Calculando distância de geometrias próximas com GeoJSON
```
db.locais.aggregate([
    {
        $geoNear: {
            near: {
                type: "Point",
                coordinates: [-51.4086826635242, -22.1158420778203],     //PrudenShopping
            },
            spherical: true,
            maxDistance: 500,    //500 metros
            distanceField: "distance"
        }
    },
    {
        $project: { _id: 0, nome: 1, distance: 1 }      //escolhe os campos retornados
    },
])
```

## Verificando pontos que estão contidos em um polígono
```
db.locais.find({
    localizacao: {
        $geoWithin: {
            $geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [
                      -51.384429931640625,
                      -22.127070345658982
                    ],
                    [
                      -51.403956413269036,
                      -22.117807204917316
                    ],
                    [
                      -51.408247947692864,
                      -22.115819327142624
                    ],
                    [
                      -51.41206741333008,
                      -22.115739811448652
                    ],
                    [
                      -51.41404151916504,
                      -22.116455451080096
                    ],
                    [
                      -51.427388191223145,
                      -22.1261559854583
                    ],
                    [
                      -51.4264440536499,
                      -22.127070345658982
                    ],
                    [
                      -51.41296863555908,
                      -22.117012057170943
                    ],
                    [
                      -51.41178846359253,
                      -22.117648175726828
                    ],
                    [
                      -51.4089560508728,
                      -22.117230723248273
                    ],
                    [
                      -51.408226490020745,
                      -22.116793390754477
                    ],
                    [
                      -51.38455867767333,
                      -22.127825682219232
                    ],
                    [
                      -51.384429931640625,
                      -22.127070345658982
                    ]
                  ]
                ]
            },  //Av. Manoel Goulart
        }
    }
}, { nome: 1 })	//busca apenas o campo nome
```

## Verificando pontos que interceptam um polígono
```
db.locais.find({
    localizacao: {
        $geoIntersects: {
            $geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [
                      -51.384429931640625,
                      -22.127070345658982
                    ],
                    [
                      -51.403956413269036,
                      -22.117807204917316
                    ],
                    [
                      -51.408247947692864,
                      -22.115819327142624
                    ],
                    [
                      -51.41206741333008,
                      -22.115739811448652
                    ],
                    [
                      -51.41404151916504,
                      -22.116455451080096
                    ],
                    [
                      -51.427388191223145,
                      -22.1261559854583
                    ],
                    [
                      -51.4264440536499,
                      -22.127070345658982
                    ],
                    [
                      -51.41296863555908,
                      -22.117012057170943
                    ],
                    [
                      -51.41178846359253,
                      -22.117648175726828
                    ],
                    [
                      -51.4089560508728,
                      -22.117230723248273
                    ],
                    [
                      -51.408226490020745,
                      -22.116793390754477
                    ],
                    [
                      -51.38455867767333,
                      -22.127825682219232
                    ],
                    [
                      -51.384429931640625,
                      -22.127070345658982
                    ]
                  ]
                ]
            },  //Av. Manoel Goulart
        }
    }
}, { nome: 1 })	//busca apenas o campo nome
```