/*
 * Available information:
 * 1. Request queue
 * Simulator.get_instance().get_requests()
 * Array of integers representing floors where there are people calling the elevator
 * eg: [7,3,2] // There are 3 people waiting for the elevator at floor 7,3, and 2, in that order
 * 
 * 2. Elevator object
 * To get all elevators, Simulator.get_instance().get_building().get_elevator_system().get_elevators()
 * Array of Elevator objects.
 * - Current floor
 * elevator.at_floor()
 * Returns undefined if it is moving and returns the floor if it is waiting.
 * - Destination floor
 * elevator.get_destination_floor()
 * The floor the elevator is moving toward.
 * - Position
 * elevator.get_position()
 * Position of the elevator in y-axis. Not necessarily an integer.
 * - Elevator people
 * elevator.get_people()
 * Array of people inside the elevator
 * 
 * 3. Person object
 * - Floor
 * person.get_floor()
 * - Destination
 * person.get_destination_floor()
 * - Get time waiting for an elevator
 * person.get_wait_time_out_elevator()
 * - Get time waiting in an elevator
 * person.get_wait_time_in_elevator()
 * 
 * 4. Time counter
 * Simulator.get_instance().get_time_counter()
 * An integer increasing by 1 on every simulation iteration
 * 
 * 5. Building
 * Simulator.get_instance().get_building()
 * - Number of floors
 * building.get_num_floors()
 */

Elevator.prototype.decide = function() {
    var simulator = Simulator.get_instance();
    var building = simulator.get_building();
    var num_floors = building.get_num_floors();
    var elevators = Simulator.get_instance().get_building().get_elevator_system().get_elevators();
    var time_counter = simulator.get_time_counter();
    var requests = simulator.get_requests();
    
    var elevator = this;
    var people = this.get_people();
    
    if(elevator) {
        elevator.at_floor();
        elevator.get_destination_floor();
        elevator.get_position();
    }

    var elevator_index = 0;
    for (var k = 0; k < elevators.length; k++) {
        if (elevator.get_position() == elevators[k].get_position() && elevator.get_people() == elevators[k].get_people()) {
            elevator_index = k;
        }
        if (elevators[k].at_floor() == 1) {
            window['elevator' + k] = 'up';
        } else if (elevators[k].at_floor() == 30) {
            window['elevator' + k] = 'down';
        }
    }

    var people_destination = [];
    if (people.length > 0) {
        for (var x = 0; x < people.length; x++) {
            people[x].get_floor();
            people_destination.push(people[x].get_destination_floor());
        }
    }

    if (window['elevator' + elevator_index] == 'up') {
        requests.sort(function (a, b) { return a - b });
        people_destination.sort(function (a, b) { return a - b });
    } else if (window['elevator' + elevator_index] == 'down') {
        requests.sort(function (a, b) { return b - a });        
        people_destination.sort(function (a, b) { return b - a });        
    }

    if (people.length > 0) {
        for (var l = 0; l < people_destination.length; l++) {
            var the_diff = people_destination[l] - elevator.at_floor();
            if (window['elevator' + elevator_index] == 'up' && the_diff > 0) {
                return this.commit_decision(people_destination[l]);
            } else if (window['elevator' + elevator_index] == 'down' && the_diff < 0) {
                return this.commit_decision(people_destination[l]);
            }
        }
    }
    
    for(var i = 0;i < requests.length;i++) {
        var handled = false;
        for(var j = 0;j < elevators.length;j++) {
            if(elevators[j].get_destination_floor() == requests[i]) {
                handled = true;
                break;
            }
        }
        if(!handled) {
            var the_diff = requests[i] - elevator.at_floor();
            if (window['elevator' + elevator_index] == 'up' && the_diff > 0) {
                return this.commit_decision(requests[i]);
            } else if (window['elevator' + elevator_index] == 'down' && the_diff < 0) {
                return this.commit_decision(requests[i]);
            }
        }
    }

    return this.commit_decision(1);
};
