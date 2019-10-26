import React, { Component } from 'react'

import ConsumerComponent from './Consumer'

export default class Second extends Component {
    render() {
        return (
            <div>
                儿子组件<br/>
                <ConsumerComponent />
            </div>
        )
    }
}
