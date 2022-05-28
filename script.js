url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

let moviesData;


const canvas = d3.select('#canvas');
const tooltip = d3.select('#tooltip');

const colorByCagegory = (movie) => {
    let category = movie['data']['category']
    if(category === 'Action'){
        return 'var(--ind-1)'
    }else if(category === 'Drama'){
        return 'var(--ind-2)'
    }else if(category === 'Adventure'){
        return 'var(--ind-3)'
    }else if(category === 'Family'){
        return 'var(--ind-4)'
    }else if(category === 'Animation'){
        return 'var(--ind-5)'
    }else if(category === 'Comedy'){
        return 'var(--ind-6)'
    }else if(category === 'Biography'){
        return 'var(--ind-7)'
    }
}

let drawTreeMap = () => {
    //creates hierarchy by pointing the children in the d3.hierarchy method
    let hierarchy = d3.hierarchy(moviesData, (node) => {
        return node['children']
    }).sum((node) => {
        //defines the comparison parameter to define which areas has more weight/takes more space
        return node['value']
    }).sort((node1, node2) => {
        //sorts by descending order of revenue
        return node2['value'] - node1['value']
    })

    //creates a variable to store the treemap generator method, also pass the size of canvas to it 
    let createTreeMap = d3.treemap()
                            .size([1000, 600])
    //generates the x and y coordinates of each leave of the hierarchy by giving the hierarchy as argument to the d3.treemap method
    createTreeMap(hierarchy)
    
    //stores the processed hierarchy leaves for clarity
    let movieTiles = hierarchy.leaves();
    console.log(movieTiles)
    //appends the blocks which will contain the rectangles and text representing the data
    let block = canvas.selectAll('g')
                        .data(movieTiles)
                        .enter()
                        .append('g')
                        .attr('transform', (movie) => {
                            return 'translate(' + movie['x0'] + ', ' + movie['y0'] + ')'
                        })
    //appends the rectangles to each block
    block.append('rect')
            .attr('class', 'tile')
            .attr('fill', (movie) => {
                return colorByCagegory(movie)
            })
            .attr('data-name', (movie) => movie['data']['name'])
            .attr('data-category', (movie) => movie['data']['category'])
            .attr('data-value', (movie) => movie['data']['value'])
            .attr('width', (movie) => {
                return movie['x1'] - movie['x0']
            })
            .attr('height', (movie) => {
                return movie['y1'] - movie['y0']
            })
            .on('mousemove', (event, movie) => {
                tooltip.attr('data-value', movie['data']['value']) 
                tooltip.transition()
                    .style('opacity', '0.9')
                
                tooltip
                    .style('left', event.pageX + 8 + 'px')
                    .style('top', event.pageY - 22 + 'px')
                
                let vRegex = /\B(?=(\d{3})+(?!\d))/g
                let revenue = movie['data']['value'].toString().replace(vRegex, ',')

                tooltip.text(
                    '$ ' + revenue + ' | ' + movie['data']['name']
                )

                
            })
            .on('mouseout', (event, movie) => {
                tooltip.transition()
                    .style('opacity', '0')
            })
    
    block.append('text')
            .text((movie) => {
                return movie['data']['name']
            })
            .attr('x', 5)
            .attr('y', 20)
}

d3.json(url)
    .then((data) => {
        moviesData = data;
        drawTreeMap();
    })
    .catch((err) => console.log(err))