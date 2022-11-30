import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class PokedexPage extends Component {

    state = {
        data: [],
        name: "",
        sprite_default: "",
        sprite_back: "",
        page: "",
        types: "",
        descripcion: "",
        evos: [],
        stats: [],
        statsPor: [],
        error: false,
        pageLoading: true
    }

    async componentDidMount() {

        if (this.props.match.params.page) {
            let res
            let res2
            let res3
            try {
                res = await axios.get('https://pokeapi.co/api/v2/pokemon/' + this.props.match.params.page);
                res2 = await axios.get('https://pokeapi.co/api/v2/pokemon-species/' + this.props.match.params.page);
                res3 = await axios.get(res2.data.evolution_chain.url);
            } catch (e) {
                console.log(e)
                this.setState({ error: true, pageLoading: false })
                return
            }

            let types = ""

            res.data.types.forEach((element, index) => {
                if (index == 0 && res.data.types.length > 1) {
                    types = element.type.name[0].toUpperCase() + element.type.name.slice(1) + "/"
                }
                else {
                    types += element.type.name[0].toUpperCase() + element.type.name.slice(1)
                }
                //types.push(element.type.name) 
            });

            console.log(res2.data)

            let descripcion = ""

            res2.data.flavor_text_entries.forEach(element => {
                if (element.language.name == "en") {
                    descripcion = element.flavor_text
                }
            });

            let chain = res3.data.chain
            let lisEvo = []
            let lisEvoS = []
            let lisImgs = []
            lisEvo = this.evolutions(chain, lisEvo)

            lisEvo.forEach(element => {
                lisEvoS.push(element.species.name)
            })

            for (const element of lisEvoS) {
                const img = await axios.get('https://pokeapi.co/api/v2/pokemon/' + element);
                lisImgs.push(img.data.sprites.front_default)
            }

            let stats = []
            let stats_por = []
            res.data.stats.forEach(element => (
                stats.push(element.base_stat)
            ))

            stats_por = this.statsPor(stats)
            console.log(stats_por)

            this.setState({
                data: res.data,
                name: res.data.name[0].toUpperCase() + res.data.name.slice(1),
                sprite_default: res.data.sprites.front_default,
                page: this.props.match.params.page,
                types: types,
                descripcion: descripcion,
                evos: lisImgs,
                stats: stats,
                statsPor: stats_por,
                pageLoading: false
            })
            console.log(this.state)
        }
    }

    evolutions(data, lista) {
        lista.push(data)

        if (data.evolves_to.length != 0) {
            this.evolutions(data.evolves_to[0], lista)
        }

        return lista

    }

    statsPor(stats) {
        let lista = []
        let max = 255
        // 255 --- 100%
        //  x       ?
        stats.forEach(element => (
            lista.push((element * 100) / 255)
        ))
        return lista
    }

    render() {
        return (
            <div>
                <div class="card" >
                    <div class="card-body bg-custom-1" style={{ backgroudColor: "red" }}>
                        <div hidden={this.state.pageLoading ? true : false}>
                            <div class="container" hidden={this.state.error ? true : false}>
                                <div class="row align-items-start">
                                    <div class="col shadow-lg p-3 mb-5 bg-body rounded">
                                        <h4 style={{ fontFamily: "Ketchum", fontSize: "40px" }}>#{this.state.data.id}</h4>
                                        <h2 className="d-flex justify-content-center" style={{ fontFamily: "Ketchum", fontSize: "80px" }}>{this.state.name}</h2>
                                        <img src={this.state.sprite_default} alt="not available" height={500} width={500} />
                                        <h3 className="d-flex justify-content-center" style={{ fontFamily: "Ketchum", fontSize: "80px" }}>{this.state.types}</h3>
                                    </div>
                                    <div class="col" style={{ margin: "15px" }}>
                                        <p style={{ fontSize: "30px" }}>{this.state.descripcion}</p>
                                        <br />
                                        <br />
                                        <h5 className='d-flex justify-content-center' style={{ fontFamily: "Ketchum", fontSize: "40px" }}>Evolution</h5>
                                        <div className="d-flex justify-content-center">
                                            {
                                                this.state.evos.map((img, index) => (
                                                    <span>
                                                        <img src={img} />
                                                        <img src="https://static.vecteezy.com/system/resources/thumbnails/008/844/878/small/arrow-icon-design-free-png.png" height={20} hidden={(this.state.evos.length - 1) == index ? true : false} />
                                                    </span>

                                                ))
                                            }

                                        </div>
                                        <div>
                                            <h5 style={{ fontFamily: "Ketchum", fontSize: "40px" }}>Stats</h5>
                                            <br />

                                            <p style={{ fontSize: "20px" }}>HP</p>
                                            <div class="progress">
                                                <div class="progress-bar" role="progressbar" style={{ width: this.state.statsPor[0] + "%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.state.stats[0]}</div>
                                            </div>
                                            <p style={{ fontSize: "20px" }}>Attack</p>
                                            <div class="progress">
                                                <div class="progress-bar bg-danger" role="progressbar" style={{ width: this.state.statsPor[1] + "%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.state.stats[1]}</div>
                                            </div>
                                            <p style={{ fontSize: "20px" }}>Defense</p>
                                            <div class="progress">
                                                <div class="progress-bar  bg-warning" role="progressbar" style={{ width: this.state.statsPor[2] + "%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.state.stats[2]}</div>
                                            </div>
                                            <p style={{ fontSize: "20px" }}>Sprecial Attack</p>
                                            <div class="progress">
                                                <div class="progress-bar bg-success" role="progressbar" style={{ width: this.state.statsPor[3] + "%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.state.stats[3]}</div>
                                            </div>
                                            <p style={{ fontSize: "20px" }}>Special Defense</p>
                                            <div class="progress">
                                                <div class="progress-bar  bg-secondary" role="progressbar" style={{ width: this.state.statsPor[4] + "%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.state.stats[4]}</div>
                                            </div>
                                            <p style={{ fontSize: "20px" }}>Speed</p>
                                            <div class="progress">
                                                <div class="progress-bar bg-dark" role="progressbar" style={{ width: this.state.statsPor[5] + "%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.state.stats[5]}</div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="container" hidden={this.state.error ? false : true}>
                                <h2 className="d-flex justify-content-center" style={{ fontFamily: "Ketchum", fontSize: "30px" }}>Error 404: Not Found</h2>
                            </div>
                        </div>
                        <p className='d-flex justify-content-center'>
                            <div class="spinner-border text-danger " role="status" hidden={this.state.pageLoading ? false : true}>
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
