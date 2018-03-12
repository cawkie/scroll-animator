function ScrollAnimator(options) {
    // console.log('scrollanimator strted');
    if (arguments.length < 1) return;
    var events = [];
    var scrollpostions = [];

    var container = options.container || document.getElementsByTagName('body');
    var scrollMeter = options.scrollMeter || false;
    var defaultStep = options.defaultStep || 100;
    var actions = options.actions || [];

    if(scrollMeter){
        createScrollMeter();
    }

    for (var idx1 = 0; idx1 < actions.length; idx1++) {
        var action = actions[idx1];
        var step = action.step || defaultStep;
        var startScroll = action.startScroll || 0;
        var endScroll = action.endScroll || 0;
        var target = action.target;
        var changes = action.changes || [];
// console.log('changes',changes.length);
        var set = action.set || [];
        for (var idx2 = 0; idx2 < changes.length; idx2++) {
            var change = changes[idx2];
            if (change) {
                var unit = change.unit || '';
                var moves = (endScroll - startScroll) / step;
                var move_amount = (change.endValue - change.startValue) / moves;
                var value = change.startValue;
// console.log('move_amount',move_amount  );
                for (var idx3 = startScroll; idx3 < endScroll; idx3 = idx3 + step) {
                    event = {
                        target: target,
                        property: change.property,
                        unit: unit,
                        value: value,
                        scrollPosition: idx3,
                    };
                    // console.log('push event',event);
                    events.push(event);
                    value = value + move_amount;
                }

                event = {
                    target: target,
                    property: change.property,
                    unit: unit,
                    value: change.endValue,
                    scrollPosition: endScroll,
                };
                // console.log('push event',event);
                events.push(event);

            }
        }
        for (idx2 = 0; idx2 < set.length; idx2++) {

            var unit = set[idx2].unit || '';
            var event = null;
            event = {
                target: target,
                property: set[idx2].property,
                unit: unit,
                value: set[idx2].value,
                scrollPosition: startScroll,
            };
            // console.log('push set event', event);
            events.push(event);
            event = {
                target: target,
                property: set[idx2].property,
                unit: unit,
                value: set[idx2].value,
                scrollPosition: endScroll,
            };
            // console.log('push set event', event);
            events.push(event);

        }
    }


    function setEventsToScollPosition() {
        var idx = 0;
        // console.log('setEventsToScollPosition',window.scrollY +' - '+ lastScrollPosition);
        if (window.scrollY >= lastScrollPosition) {
            for (idx = lastScrollPosition; idx < window.scrollY; idx++) {
                // console.log('idx',idx);
                setEventsAtPosition(idx);
            }
        } else {
            for (idx = lastScrollPosition; idx >= window.scrollY; idx--) {
                // console.log('idx',idx);
                setEventsAtPosition(idx);
            }

        }
        lastScrollPosition = idx;

    }

    function setEventsAtPosition(position) {
        console.log('setEventsAtPosition', scrollMeter);
        if(scrollMeter) setScrollMeter(position);
        for (var idx = 0; idx < events.length; idx++) {
            if (events[idx].scrollPosition === position) {
                var event = events[idx];
                // console.log(event, event.value + event.unit);
                // if (event.property == 'z-index') console.log(event.target, 'z-index=' + event.value + event.unit);
                event.target.style.setProperty(event.property, event.value + event.unit);
            }
        }

    }

    function createScrollMeter(){
        document.write('<div id="scrollMeter" style="position: fixed; top:0;left:0; width: 200px; height: 30px;background-color: #bfbfbf;"></div>');
        scrollMeter=document.getElementById('scrollMeter');
    }
    function setScrollMeter(position){
        scrollMeter.innerHTML=position;
    }

    var lastScrollPosition = 0;
    // setEventsToScollPosition();
    window.addEventListener('scroll', function (e) {
        setEventsToScollPosition();
    });

}
