angular.module('subsApp')
    .controller('subsCtrl', function($scope,$http) {

        $scope.input = {}

        $http.get('/fhir/Subscription').then(
            function(data) {
                console.log(data)
                $scope.subscriptions = data.data;
            },
            function(err) {
                console.log(err)
            }
        );

        $scope.find = function(name) {
            delete $scope.selectedPatient;
            delete $scope.patientList;
            let qry = '/fhir/Patient?name='+name;
            $http.get(qry).then(
                function(data) {
                    console.log(data)
                    $scope.patientList = data.data;
                },
                function(err) {
                    console.log(err)
                }
            )
        };

        $scope.getPatientDisplay = function(patient) {
            let disp = '';
            if (patient) {
                let name = patient.name;
                if (patient.name) {
                    if (patient.name[0].given) {
                        patient.name[0].given.forEach(function(g){
                            disp += g + " ";
                        })
                    }
                    disp += patient.name[0].family;
                }
            }

            return disp;
        };

        $scope.selectPatient = function(patient) {
            $scope.selectedPatient = patient;
        };

        $scope.makeSubscription = function(patient){

            let sub = {resourceType:'Subscription',status:'active',channel:[]};
            sub.criteria = 'Encounter?subject=Patient/'+$scope.selectedPatient.id;
            sub.reason = 'test';

            let channel = {}
            channel.type='rest-hook';
            channel.endpoint = './notify';
            sub.channel.push(channel);

            let qry = '/fhir/Subscription';
            $http.post(qry,sub).then(
                function(data) {
                    console.log(data)
                    $scope.patientList = data.data;
                },
                function(err) {
                    console.log(err)
                }
            )
        }




    });