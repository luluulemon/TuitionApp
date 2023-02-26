package vttp.course.tuition.server.services;

public class util {
    
    // Use for optional SQL fields, avoid null on Json
    public static <T> T defaultValue(T actual, T defVal){
        if(null == actual)
             return defVal;
        return actual;     }
   
}
