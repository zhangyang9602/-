import React, { Component } from 'react'

import cat from '../images/cat2.jpg'


class Mouse extends Component{
    state = {
        x:0,
        y:0
    }

    handleMouseMove = e => {
        this.setState({
            x:e.clientX,
            y:e.clientY
        })
    }

    componentDidMount(){
        window.addEventListener('mousemove',this.handleMouseMove)
    }

    componentWillUnmount(){
        window.removeEventListener('mousemove',this.handleMouseMove)
    }

    render(){
        // return this.props.render(this.state)

        return this.props.children(this.state)
    }
}

export default class Index extends Component {
    render() {
        return (
            <div>
                {/* <Mouse render={({x,y}) => <span>坐标是 {x} - {y}</span>}/> */}
                {/* <Mouse render={({x,y}) => <img style={{width:100,height:80,position:'absolute',top:y - 40,left:y - 50}} src={cat} />}/> */}

                {/* <Mouse>
                    {({x,y}) => <span>坐标是 {x} - {y}</span>}
                </Mouse> */}

                <Mouse>
                    {({x,y}) => <img style={{width:100,height:80,position:'absolute',top:y - 40,left:x - 50}} src={cat} />}
                </Mouse>
            </div>
        )
    }
}
