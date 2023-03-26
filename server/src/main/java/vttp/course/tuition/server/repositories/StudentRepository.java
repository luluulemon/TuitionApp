package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import static vttp.course.tuition.server.repositories.Queries.*;

@Repository
public class StudentRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public SqlRowSet getStudentDetails(int phoneNum){
        return jdbcTemplate.queryForRowSet(SQL_GET_STUDENT_DETAILS, phoneNum);
    }
}
