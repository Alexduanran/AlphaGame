import React, { useState } from 'react';
import { Form, FormControl, InputGroup, Button, ButtonGroup, Tooltip, OverlayTrigger, Row, Col } from 'react-bootstrap';

function GeneticParams(props) {
    const [numLayer, setNumLayer] = useState(2);
    const [hiddenLayerArchitecture, setHiddenLayerArchitecture] = useState([12, 6]);
    const [mutationRate, setMutationRate] = useState(0.5);
    const [mutationRateType, setMutationRateType] = useState('static');
    const [numParents, setNumParents] = useState(50);
    const [numOffsprings, setNumOffsprings] = useState(100);

    return (
        <div style={{position:'absolute', top:'2.5%', width:'100%'}}>
            <Form>
                <Form.Group as={Row}>
                    <Form.Label column sm='5' style={{color:'white', left:'4%'}}>
                        Hidden Layer Architecture
                    </Form.Label>
                    <Col style={{right:'4%'}}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <Button style={{backgroundColor:'blueviolet', borderColor:'blueviolet'}} onClick={()=>setNumLayer(numLayer == 1 ? 1 : numLayer-1)}>
                                    -
                                </Button>
                                <Button style={{backgroundColor:'blueviolet', borderColor:'blueviolet'}} onClick={()=>setNumLayer(numLayer == 3 ? 3 : numLayer+1)}>
                                    +
                                </Button>
                            </InputGroup.Prepend>
                            {
                                [...Array(numLayer)].map((value, index) => {
                                    return <FormControl placeholder={'layer'+(index+1).toString()} key={index} defaultValue={hiddenLayerArchitecture[index]}
                                            // style={{width}}
                                            onChange={e => {
                                                var layers = hiddenLayerArchitecture;
                                                layers[index] = Number(e.target.value);
                                                setHiddenLayerArchitecture(layers);
                                            }}/>
                                })
                            }
                            <InputGroup.Append>
                                <OverlayTrigger overlay={<Tooltip>Enter the number of nodes in each layer</Tooltip>}>
                                    <Button style={{backgroundColor:'blueviolet', borderColor:'blueviolet', cursor:'default'}}>
                                        &#9432;
                                    </Button>
                                </OverlayTrigger>
                            </InputGroup.Append>
                        </InputGroup>               
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm='5' style={{color:'white', left:'4%'}}>
                        Mutation Rate
                    </Form.Label>
                    <Col style={{right:'4%'}}>
                        <InputGroup>
                            <FormControl defaultValue={mutationRate} onChange={e => setMutationRate(Number(e.target.value))}/>
                            <InputGroup.Append>
                                <OverlayTrigger overlay={<Tooltip>Enter the number of nodes in each layer</Tooltip>}>
                                    <Button style={{backgroundColor:'blueviolet', borderColor:'blueviolet', cursor:'default'}}>
                                        &#9432;
                                    </Button>
                                </OverlayTrigger>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm='5' style={{color:'white', left:'4%'}}>
                        Mutation Rate Type
                    </Form.Label>
                    <Col style={{right:'4%'}}>
                        <ButtonGroup>
                            <Button style={{backgroundColor:mutationRateType==='static' ? '#6918b4' : 'blueviolet', borderColor:'blueviolet'}} onClick={()=>setMutationRateType('static')}>Static</Button>
                            <Button style={{backgroundColor:mutationRateType==='decay' ? '#6918b4' : 'blueviolet', borderColor:'blueviolet'}} onClick={()=>setMutationRateType('decay')}>Decay</Button>
                        </ButtonGroup>
                    </Col>
                    <Col style={{left:'13.2%'}}>
                        <OverlayTrigger overlay={<Tooltip >
                                                    Static: Mutation rate stays the same throughout generations <br />
                                                    Decay: Mutation rate decreases as generation increasesr
                                                </Tooltip>}>
                            <Button style={{backgroundColor:'blueviolet', borderColor:'blueviolet', cursor:'default'}}>
                                &#9432;
                            </Button>
                        </OverlayTrigger>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm='5' style={{color:'white', left:'4%'}}>
                        Number of Parents
                    </Form.Label>
                    <Col style={{right:'4%'}}>
                        <InputGroup>
                            <FormControl defaultValue={numParents} onChange={e => setNumParents(Number(e.target.value))}/>
                            <InputGroup.Append>
                                <OverlayTrigger overlay={<Tooltip>Enter the number of parents to generate offsprings</Tooltip>}>
                                    <Button style={{backgroundColor:'blueviolet', borderColor:'blueviolet', cursor:'default'}}>
                                        &#9432;
                                    </Button>
                                </OverlayTrigger>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm='5' style={{color:'white', left:'4%'}}>
                        Number of Offsprings
                    </Form.Label>
                    <Col style={{right:'4%'}}>
                        <InputGroup>
                            <FormControl defaultValue={numOffsprings} onChange={e => setNumOffsprings(Number(e.target.value))}/>
                            <InputGroup.Append>
                                <OverlayTrigger overlay={<Tooltip>Enter the number of offsprings to be generated by parents</Tooltip>}>
                                    <Button style={{backgroundColor:'blueviolet', borderColor:'blueviolet', cursor:'default'}}>
                                        &#9432;
                                    </Button>
                                </OverlayTrigger>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Form.Group>
                <div class='text-center'>
                    <Button size='lg' 
                            style={{width:'30%', backgroundColor:'blueviolet', borderColor:'blueviolet'}}
                            onClick={()=>{
                                        props.updateStart();
                                        props.updateSettings(hiddenLayerArchitecture,mutationRate,mutationRateType,numParents,numOffsprings);
                                    }}>
                        Start 
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default GeneticParams;