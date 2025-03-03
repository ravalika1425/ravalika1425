const scanner = require('sonarqube-scanner');

scanner(
    {
        serverUrl: 'http://localhost:9000',
        token: "sqp_f7d80dd4db1229a82cf09548a3d0cad130d3b1d5",
        options: {
            'sonar.projectName': 'react-seed',
            'sonar.projectDescription': 'Here I can add a description of my project',
            'sonar.projectKey': 'react-seed',
            'sonar.projectVersion': '0.0.1',
            'sonar.exclusions': '',
            'sonar.sourceEncoding': 'UTF-8',
        }
    },
    () => process.exit()
)