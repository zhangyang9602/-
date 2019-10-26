import React, { Component } from 'react'

import cat from '../images/cat.jpg'

const withMouse = (WrappedComponent) => {
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
            return <WrappedComponent {...this.state} {...this.props}/>
        }
    }

    return Mouse
}

class MousePrint extends Component{
    render(){
        const {x,y,title} = this.props
        return <span>{title} {x} = {y}</span>
    }
}

class MouseCat extends Component{
    render(){
        const {x,y} = this.props
        
        return <img style={{width:100,height:80,position:'absolute',top:y - 40,left:x - 50}} src={cat}/>
    }
}

const MousePrintComponent = withMouse(MousePrint)

const MouseCatComponent = withMouse(MouseCat)

export default class Index extends Component {
    render() {
        return (
            <div>
                <MousePrintComponent title="666获取到的坐标是："/>

                <MouseCatComponent />
            </div>
        )
    }
}
